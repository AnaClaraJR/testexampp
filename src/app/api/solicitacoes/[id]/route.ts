import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";

// Atualizado para Next.js 15: params agora é explicitamente uma Promise
export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CORREÇÃO AQUI: Aguarda a Promise do params ser resolvida (obrigatório no Next 15)
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID da solicitação não fornecido" }, { status: 400 });
    }

    const body = await request.json();
    const { action, destaque, motivo_rejeicao } = body;

    const [solicitacaoRows] = await db.execute(
      "SELECT * FROM solicitacoes_patrimonio WHERE id = ? LIMIT 1",
      [id],
    ) as [Array<Record<string, unknown>>, unknown];

    if (!Array.isArray(solicitacaoRows) || solicitacaoRows.length === 0) {
      return NextResponse.json({ success: false, error: "Solicitação não encontrada no banco" }, { status: 404 });
    }

    const solicitacao = solicitacaoRows[0];
    const novoStatus = action ?? solicitacao.status;
    const atualDestaque = typeof destaque === "boolean"
      ? destaque
      : solicitacao.destaque === 1 || solicitacao.destaque === "1" || solicitacao.destaque === true;
    const destaqueValue = atualDestaque ? 1 : 0;

    const updates: string[] = [];
    const parameters: Array<string | number | null> = [];
    let shouldUpdateSolicitacao = false;

    if (action) {
      if (!["aprovado", "rejeitado", "pendente"].includes(action)) {
        return NextResponse.json({ success: false, error: "Ação inválida" }, { status: 400 });
      }
      updates.push("status = ?");
      parameters.push(action);
      updates.push("motivo_rejeicao = ?");
      parameters.push(action === "rejeitado"
        ? motivo_rejeicao?.trim() || "Recusado na curadoria."
        : null,
      );
      shouldUpdateSolicitacao = true;
    }

    if (!shouldUpdateSolicitacao && typeof destaque !== "boolean") {
      return NextResponse.json({ success: false, error: "Nenhuma alteração válida fornecida" }, { status: 400 });
    }

    const slug = typeof solicitacao.slug === "string" ? solicitacao.slug : "";
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug da solicitação inválido" }, { status: 400 });
    }

    const [pontosColumnsRows] = await db.execute(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'pontos_turisticos'",
    ) as [Array<{ column_name: string }>, unknown];
    const pontoColumns = new Set(pontosColumnsRows.map((col) => col.column_name));

    const [solicitacaoColumnsRows] = await db.execute(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'solicitacoes_patrimonio'",
    ) as [Array<{ column_name: string }>, unknown];
    const solicitacaoColumns = new Set(solicitacaoColumnsRows.map((col) => col.column_name));

    const [existingPontoRows] = await db.execute(
      "SELECT id FROM pontos_turisticos WHERE slug = ? LIMIT 1",
      [slug],
    ) as [Array<Record<string, unknown>>, unknown];
    const pontoExiste = Array.isArray(existingPontoRows) && existingPontoRows.length > 0;
    const devePublicar = novoStatus === "aprovado";

    const hasSolicitacaoDestaqueColumn = solicitacaoColumns.has("destaque");
    if (typeof destaque === "boolean" && hasSolicitacaoDestaqueColumn) {
      updates.push("destaque = ?");
      parameters.push(destaqueValue);
      shouldUpdateSolicitacao = true;
    }

    if (shouldUpdateSolicitacao) {
      const query = `UPDATE solicitacoes_patrimonio SET ${updates.join(", ")} WHERE id = ?`;
      const [result] = await db.execute(query, [...parameters, id]) as [
        { affectedRows?: number },
        unknown,
      ];
      if ((result.affectedRows ?? 0) === 0) {
        return NextResponse.json({ success: false, error: "Solicitação não encontrada no banco" }, { status: 404 });
      }
    }

    if (devePublicar) {
      const dadosParaPontos: Record<string, unknown> = {
        slug: solicitacao.slug,
        nome: solicitacao.nome,
        descricao_historica: solicitacao.descricao ?? solicitacao.descricao_historica ?? null,
        descricao: solicitacao.descricao ?? null,
        cidade: solicitacao.localizacao ?? null,
        localizacao: solicitacao.localizacao ?? null,
        url_foto_principal: solicitacao.url_foto_principal ?? null,
        categoria_id: solicitacao.categoria_id ?? null,
        solicitacao_id: solicitacao.id ?? null,
        referencias: solicitacao.referencias ?? null,
        destaque: destaqueValue,
      };

      const valoresParaPontos = Object.entries(dadosParaPontos)
        .filter(([coluna, valor]) => pontoColumns.has(coluna) && valor !== undefined)
        .map(([coluna, valor]) => ({ coluna, valor }));

      if (pontoExiste) {
        const updateColumns = valoresParaPontos
          .filter((item) => item.coluna !== "slug")
          .map((item) => `${item.coluna} = ?`);
        const updateValues = valoresParaPontos
          .filter((item) => item.coluna !== "slug")
          .map((item) => item.valor as string | number | null);
        if (updateColumns.length > 0) {
          await db.execute(
            `UPDATE pontos_turisticos SET ${updateColumns.join(", ")} WHERE slug = ?`,
            [...updateValues, slug],
          );
        }
      } else if (valoresParaPontos.length > 0) {
        const insertColumns = valoresParaPontos.map((item) => item.coluna);
        const placeholders = insertColumns.map(() => "?").join(", ");
        const insertValues = valoresParaPontos.map((item) => item.valor as string | number | null);
        const insertQuery = `INSERT INTO pontos_turisticos (${insertColumns.join(", ")}) VALUES (${placeholders})`;
        try {
          await db.execute(insertQuery, insertValues);
        } catch (err: unknown) {
          // Se já existir um ponto com o mesmo slug, atualizamos em vez de falhar
          // Código de erro MySQL para entrada duplicada é ER_DUP_ENTRY (errno 1062)
          const anyErr = err as any;
          const isDup = anyErr && (anyErr.code === "ER_DUP_ENTRY" || anyErr.errno === 1062);
          if (isDup) {
            const updateColumns = insertColumns.filter((c) => c !== "slug");
            const updateAssignments = updateColumns.map((c) => `${c} = ?`);
            const updateValues = insertValues.filter((_, i) => insertColumns[i] !== "slug");
            if (updateAssignments.length > 0) {
              await db.execute(`UPDATE pontos_turisticos SET ${updateAssignments.join(", ")} WHERE slug = ?`, [
                ...updateValues,
                slug,
              ]);
            }
          } else {
            throw err;
          }
        }
      }
    } else if (pontoExiste) {
      await db.execute("DELETE FROM pontos_turisticos WHERE slug = ?", [slug]);
    }


    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}