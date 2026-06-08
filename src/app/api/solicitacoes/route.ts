import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";

// Método POST: Salva a sugestão enviada pelo site dentro do MariaDB (XAMPP)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      categoria_id: rawCategoriaId,
      categoria: rawCategoria,
      nome,
      slug,
      descricao,
      localizacao,
      url_foto_principal,
      referencias,
      usuario_sugeriu,
    } = body;

    const [categoriaIdColumnRows] = await db.execute(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'solicitacoes_patrimonio' AND column_name = 'categoria_id'"
    ) as [Array<{ column_name: string }>, unknown];
    const [categoriaColumnRows] = await db.execute(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'solicitacoes_patrimonio' AND column_name = 'categoria'"
    ) as [Array<{ column_name: string }>, unknown];
    const [referenciasColumnRows] = await db.execute(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'solicitacoes_patrimonio' AND column_name = 'referencias'"
    ) as [Array<{ column_name: string }>, unknown];

    const hasCategoriaIdColumn = categoriaIdColumnRows.length > 0;
    const hasCategoriaColumn = categoriaColumnRows.length > 0;
    const hasReferenciasColumn = referenciasColumnRows.length > 0;

    let categoriaId: number | null = null;
    if (typeof rawCategoriaId === "number" && Number.isInteger(rawCategoriaId)) {
      if (hasCategoriaIdColumn) {
        const [categoriaRows] = await db.execute(
          "SELECT id FROM categorias WHERE id = ? LIMIT 1",
          [rawCategoriaId],
        ) as [Array<{ id: number }>, unknown];
        if (categoriaRows.length > 0) {
          categoriaId = rawCategoriaId;
        }
      }
    }

    const categoriaTexto = typeof rawCategoria === "string" ? rawCategoria.trim() : "";
    if (categoriaId === null && categoriaTexto && hasCategoriaIdColumn) {
      const [categoriaRows] = await db.execute(
        "SELECT id FROM categorias WHERE LOWER(nome) = LOWER(?) LIMIT 1",
        [categoriaTexto],
      ) as [Array<{ id: number }>, unknown];
      if (categoriaRows.length > 0) {
        categoriaId = categoriaRows[0].id;
      }
    }

    if (hasCategoriaIdColumn && categoriaId === null && !hasCategoriaColumn) {
      return NextResponse.json({ success: false, error: "Categoria inválida ou ausente." }, { status: 400 });
    }

    const columns = [
      ...(hasCategoriaIdColumn && categoriaId !== null ? ["categoria_id"] : []),
      ...(hasCategoriaColumn && categoriaTexto ? ["categoria"] : []),
      "nome",
      "slug",
      "descricao",
      "localizacao",
      "url_foto_principal",
      ...(hasReferenciasColumn ? ["referencias"] : []),
      "usuario_sugeriu",
      "status",
    ];

    const placeholders = columns.map(() => "?").join(", ");
    const values: Array<string | number | null> = [
      ...(hasCategoriaIdColumn && categoriaId !== null ? [categoriaId] : []),
      ...(hasCategoriaColumn && categoriaTexto ? [categoriaTexto] : []),
      nome,
      slug,
      descricao,
      localizacao,
      url_foto_principal,
      ...(hasReferenciasColumn ? [referencias || null] : []),
      usuario_sugeriu,
      "pendente",
    ];

    const query = `
      INSERT INTO solicitacoes_patrimonio (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    const [result] = await db.execute(query, values) as [{ insertId?: number }, unknown];

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Método GET: Puxa os dados do MariaDB para mostrar no painel do Admin
export async function GET() {
  try {
    const [rows] = await db.execute(
      `SELECT s.*, c.nome AS categoria
       FROM solicitacoes_patrimonio s
       LEFT JOIN categorias c ON s.categoria_id = c.id
       ORDER BY s.criado_em DESC`
    ) as [Array<Record<string, unknown>>, unknown];
    return NextResponse.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}