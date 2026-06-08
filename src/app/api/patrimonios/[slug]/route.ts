import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";
import { RowDataPacket } from "mysql2";
import { mapCategoriaIdToNome } from "@/lib/patrimonios";

// 1. Criamos a interface herdando de RowDataPacket para o mysql2 aceitar nativamente
interface PontoTuristicoRow extends RowDataPacket {
  id: number;
  categoria_id?: number;
  categoria?: string;
  nome: string;
  slug: string;
  descricao?: string;
  descricao_historica?: string;
  cidade: string;
  bairro?: string;
  endereco?: string;
  url_foto_principal?: string;
  referencias?: string;
  localizacao?: string;
  foto_url?: string;
  destaque?: boolean | number | string;
  visitacao_aberta?: boolean | number | string;
}

interface FotoRow extends RowDataPacket {
  id: number;
  ponto_id: number;
  url_imagem: string;
  legenda?: string;
  e_principal: number;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || slug === "undefined" || slug === "null") {
      return NextResponse.json({ error: "Slug inválido ou não fornecido" }, { status: 400 });
    }

    // Buscando no banco usando a tipagem correta exigida pelo ESLint
    const [rows] = await db.execute<PontoTuristicoRow[]>(
      `SELECT p.*, c.nome AS categoria
       FROM pontos_turisticos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE LOWER(p.slug) = ?
       LIMIT 1`,
      [slug.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Patrimônio não encontrado no banco" }, { status: 404 });
    }

    const patrimonio = rows[0];

    // Cria uma cópia limpa do objeto e normaliza as colunas de descrição para evitar o 404 visual
    const dadosFormatados = {
      ...patrimonio,
      cidade: patrimonio.cidade || patrimonio.localizacao || "",
      categoria: patrimonio.categoria
        ? mapCategoriaIdToNome(patrimonio.categoria)
        : mapCategoriaIdToNome(patrimonio.categoria_id),
      destaque:
        patrimonio.destaque === 1 || patrimonio.destaque === "1" || patrimonio.destaque === true,
      visitacao_aberta:
        patrimonio.visitacao_aberta === 1 || patrimonio.visitacao_aberta === "1" || patrimonio.visitacao_aberta === true,
      url_foto_principal: patrimonio.url_foto_principal || patrimonio.foto_url || "",
      descricao_historica: patrimonio.descricao_historica || patrimonio.descricao || "",
      referencias: patrimonio.referencias || "",
    };

    let fotos: FotoRow[] = [];
    try {
      const [resultadoFotos] = await db.execute<FotoRow[]>(
        "SELECT * FROM galeria_fotos WHERE ponto_id = ?",
        [patrimonio.id]
      );
      fotos = resultadoFotos;
    } catch {
      // Removeu a variável 'fotoError' que o ESLint estava criticando na linha 39
      console.log("Aviso: Tabela galeria_fotos não mapeada ou vazia.");
    }

    return NextResponse.json({ ...dadosFormatados, fotos });
  } catch (error) {
    const erroMensagem = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: erroMensagem }, { status: 500 });
  }
}