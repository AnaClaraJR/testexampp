export type PatrimonioFoto = {
  url_imagem: string;
  legenda?: string;
  e_principal?: boolean;
};

export type Patrimonio = {
  id: string;
  slug: string;
  nome: string;
  descricao_historica?: string;
  endereco?: string;
  bairro?: string;
  cidade: string;
  estado_conservacao?: string;
  ano?: number;
  categoria?: string;
  categoria_id?: number | string;
  descricao?: string;
  localizacao?: string;
  estado?: string;
  website_oficial?: string;
  visitacao_aberta?: boolean | number | string;
  destaque?: boolean | number | string;
  classificacao?: string;
  justificativa?: string;
  referencias?: string;
  autor_nome?: string;
  latitude?: number;
  longitude?: number;
  fotos?: PatrimonioFoto[];
};

export const CIDADES_RONDONIA = [
  "Porto Velho",
  "Ariquemes",
  "Ji-Paraná",
  "Cacoal",
  "Vilhena",
  "Guajará-Mirim",
  "Rolim de Moura",
] as const;

export const CATEGORIAS = [
  "Histórico",
  "Cultural",
  "Turístico",
  "Natural",
  "Arquitetônico",
  "Religioso",
] as const;

export const ESTADOS_CONSERVACAO = [
  "Excelente",
  "Bom",
  "Regular",
  "Ruim",
  "Em risco",
] as const;

export function mapCategoriaIdToNome(categoria?: string | number) {
  if (categoria === undefined || categoria === null) return "";
  if (typeof categoria === "number") {
    return CATEGORIAS[categoria - 1] ?? String(categoria);
  }
  if (/^\d+$/.test(categoria)) {
    const id = Number(categoria);
    return CATEGORIAS[id - 1] ?? categoria;
  }
  return categoria;
}

export function normalizarPatrimonioRow(row: Record<string, unknown>): Patrimonio {
  return {
    ...(row as Partial<Patrimonio>),
    cidade: String(row.cidade ?? row.localizacao ?? ""),
    categoria: String(
      row.categoria ?? mapCategoriaIdToNome(row.categoria_id as string | number | undefined),
    ),
    destaque:
      row.destaque === 1 || row.destaque === "1" || row.destaque === true,
    visitacao_aberta:
      row.visitacao_aberta === 1 || row.visitacao_aberta === "1" || row.visitacao_aberta === true,
    descricao_historica: String(row.descricao_historica ?? row.descricao ?? ""),
  } as Patrimonio;
}

export const PATRIMONIOS_MOCK: Patrimonio[] = [
  {
    id: "1d0e3ff2-4a07-4a7f-a0dd-0a9d7f1e4f11",
    slug: "estrada-de-ferro-madeira-mamore",
    nome: "Estrada de Ferro Madeira-Mamoré (EFMM)",
    descricao_historica:
      "Símbolo da história amazônica e da construção ferroviária no início do século XX. Marca a memória de trabalhadores e comunidades que se formaram ao redor do eixo Madeira-Mamoré.",
    endereco: "Centro Histórico",
    bairro: "Centro",
    cidade: "Porto Velho",
    estado_conservacao: "Regular",
    ano: 1912,
    categoria: "Histórico",
    visitacao_aberta: true,
    destaque: true,
    classificacao: "Bem de relevância estadual",
    autor_nome: "Colaboração comunitária",
    fotos: [
      {
        url_imagem:
          "https://picsum.photos/id/1040/1600/900",
        legenda: "Pátio ferroviário e memória da EFMM",
        e_principal: true,
      },
      {
        url_imagem:
          "https://picsum.photos/id/1067/1600/900",
        legenda: "Detalhes e texturas de estruturas históricas",
      },
    ],
  },
  {
    id: "c5a76b74-6c70-4fb5-a2c1-3b9f6c2a1ed2",
    slug: "forte-principe-da-beira",
    nome: "Forte Príncipe da Beira",
    descricao_historica:
      "Fortificação portuguesa estratégica às margens do Guaporé, um marco de presença colonial e de disputas territoriais na Amazônia.",
    cidade: "Guajará-Mirim",
    estado_conservacao: "Bom",
    ano: 1776,
    categoria: "Histórico",
    visitacao_aberta: true,
    destaque: true,
    fotos: [
      {
        url_imagem:
          "https://picsum.photos/id/1074/1600/900",
        legenda: "Vista ampla de fortificação histórica",
        e_principal: true,
      },
    ],
  },
  {
    id: "b1d4a6b9-80c8-43bb-88b6-0c6d6a3d1b9a",
    slug: "cachoeira-do-tio-franca",
    nome: "Cachoeira (ponto natural) – Tio França",
    descricao_historica:
      "Ponto de contemplação e lazer em área de natureza preservada, associado a práticas de turismo local e valorização ambiental.",
    cidade: "Cacoal",
    estado_conservacao: "Excelente",
    categoria: "Natural",
    visitacao_aberta: true,
    destaque: false,
    fotos: [
      {
        url_imagem:
          "https://picsum.photos/id/1039/1600/900",
        legenda: "Água, mata e trilhas",
        e_principal: true,
      },
    ],
  },
  {
    id: "1b2d3e4f-5566-7788-99aa-bbccddeeff00",
    slug: "mercado-cultural-porto-velho",
    nome: "Mercado Cultural de Porto Velho",
    descricao_historica:
      "Espaço de encontro, feira e difusão cultural, com eventos, gastronomia e artesanato, fortalecendo a identidade local.",
    cidade: "Porto Velho",
    estado_conservacao: "Bom",
    categoria: "Cultural",
    visitacao_aberta: true,
    destaque: false,
    fotos: [
      {
        url_imagem:
          "https://picsum.photos/id/1060/1600/900",
        legenda: "Ambiente de feira e cultura",
        e_principal: true,
      },
    ],
  },
];

export type BuscaAvancadaFiltro = {
  q?: string;
  cidade?: string;
  categoria?: string;
  estado_conservacao?: string;
  visitacao_aberta?: "sim" | "nao" | "";
  destaque?: "sim" | "nao" | "";
};

export function filtrarPatrimonios(
  itens: Patrimonio[],
  filtro: BuscaAvancadaFiltro,
): Patrimonio[] {
  const q = (filtro.q ?? "").trim().toLowerCase();

  return itens
    .map((patrimonio) => ({
      ...patrimonio,
      categoria: patrimonio.categoria || mapCategoriaIdToNome((patrimonio as any).categoria_id),
      cidade: patrimonio.cidade || (patrimonio as any).localizacao || "",
      estado_conservacao:
        patrimonio.estado_conservacao || (patrimonio as any).estado || "",
      destaque:
        patrimonio.destaque === true || patrimonio.destaque === 1 || patrimonio.destaque === "1",
      visitacao_aberta:
        patrimonio.visitacao_aberta === true || patrimonio.visitacao_aberta === 1 || patrimonio.visitacao_aberta === "1",
      descricao_historica: patrimonio.descricao_historica || patrimonio.descricao || "",
    }))
    .filter((p) => {
      if (!q) return true;
      const hay = [
        p.nome,
        p.descricao_historica,
        p.endereco,
        p.bairro,
        p.cidade,
        p.categoria,
        p.estado_conservacao,
        p.classificacao,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    })
    .filter((p) => (filtro.cidade ? p.cidade === filtro.cidade : true))
    .filter((p) => (filtro.categoria ? p.categoria === filtro.categoria : true))
    .filter((p) =>
      filtro.estado_conservacao
        ? p.estado_conservacao === filtro.estado_conservacao
        : true,
    )
    .filter((p) => {
      if (!filtro.visitacao_aberta) return true;
      return filtro.visitacao_aberta === "sim"
        ? p.visitacao_aberta !== false
        : p.visitacao_aberta === false;
    })
    .filter((p) => {
      if (!filtro.destaque) return true;
      return filtro.destaque === "sim"
        ? p.destaque === true
        : p.destaque !== true;
    });
}

export function getPatrimonioBySlug(slug: string): Patrimonio | undefined {
  return PATRIMONIOS_MOCK.find((p) => p.slug === slug);
}

