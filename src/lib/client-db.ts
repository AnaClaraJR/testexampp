"use client";

import { PATRIMONIOS_MOCK, type Patrimonio } from "@/lib/patrimonios";

export const ADMIN_EMAIL = "administrador@email.com";

export type Usuario = {
  email: string;
  senha: string;
  nome?: string;
  isAdmin: boolean;
};

export type SessaoUsuario = {
  email: string;
  nome?: string;
  isAdmin: boolean;
};

export type SugestaoStatus = "pendente" | "aprovado" | "rejeitado";

export type Sugestao = {
  id: string;
  nome: string;
  descricao_historica: string;
  cidade: string;
  categoria?: string;
  foto_url: string;
  referencias?: string;
  criado_por_email: string;
  criado_em: string;
  status: SugestaoStatus;
  motivo_rejeicao?: string;
  analisado_em?: string;
  destaque?: boolean;
};

const STORAGE_SESSION = "acervo_sessao";
const STORAGE_SUGESTOES = "acervo_sugestoes";
const STORAGE_APROVADOS = "acervo_patrimonios_aprovados";
const STORAGE_USUARIOS = "acervo_usuarios";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getUsuarios(): Usuario[] {
  if (typeof window === "undefined") return [];
  return safeParse<Usuario[]>(localStorage.getItem(STORAGE_USUARIOS), []);
}

export function obterUsuarioPorEmail(email: string): Usuario | undefined {
  return getUsuarios().find((user) => user.email.trim().toLowerCase() === email.trim().toLowerCase());
}

export function salvarUsuario(email: string, senha: string, nome?: string) {
  if (typeof window === "undefined") return;
  const usuarios = getUsuarios();
  const usuarioExistenteIndex = usuarios.findIndex(
    (user) => user.email.trim().toLowerCase() === email.trim().toLowerCase(),
  );
  const usuario: Usuario = {
    email: email.trim(),
    senha,
    nome,
    isAdmin: email.trim().toLowerCase() === ADMIN_EMAIL,
  };

  if (usuarioExistenteIndex >= 0) {
    usuarios[usuarioExistenteIndex] = usuario;
  } else {
    usuarios.unshift(usuario);
  }

  localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(usuarios));
}

export function autenticarUsuario(email: string, senha: string): Usuario | null {
  if (typeof window === "undefined") return null;
  const usuario = obterUsuarioPorEmail(email);
  if (usuario && usuario.senha === senha) return usuario;
  if (email.trim().toLowerCase() === ADMIN_EMAIL && senha === "admin123") {
    return {
      email: email.trim(),
      senha,
      isAdmin: true,
    };
  }
  return null;
}

export function getSessao(): SessaoUsuario | null {
  if (typeof window === "undefined") return null;
  return safeParse<SessaoUsuario | null>(localStorage.getItem(STORAGE_SESSION), null);
}

export function salvarSessao(email: string, nome?: string) {
  if (typeof window === "undefined") return;
  const sessao: SessaoUsuario = {
    email,
    nome,
    isAdmin: email.trim().toLowerCase() === ADMIN_EMAIL,
  };
  localStorage.setItem(STORAGE_SESSION, JSON.stringify(sessao));
}

export function limparSessao() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_SESSION);
}

export function getSugestoes(): Sugestao[] {
  if (typeof window === "undefined") return [];
  return safeParse<Sugestao[]>(localStorage.getItem(STORAGE_SUGESTOES), []);
}

function salvarSugestoes(sugestoes: Sugestao[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_SUGESTOES, JSON.stringify(sugestoes));
}

export function criarSugestao(
  payload: Pick<
    Sugestao,
    "nome" | "descricao_historica" | "cidade" | "categoria" | "foto_url" | "referencias"
  > & {
    criado_por_email: string;
  },
) {
  const atual = getSugestoes();
  const nova: Sugestao = {
    id: crypto.randomUUID(),
    nome: payload.nome,
    descricao_historica: payload.descricao_historica,
    cidade: payload.cidade,
    categoria: payload.categoria,
    foto_url: payload.foto_url,
    referencias: payload.referencias,
    criado_por_email: payload.criado_por_email,
    criado_em: new Date().toISOString(),
    status: "pendente",
  };
  salvarSugestoes([nova, ...atual]);
  return nova;
}

export function aprovarSugestao(id: string) {
  const atual = getSugestoes();
  const idx = atual.findIndex((s) => s.id === id);
  if (idx < 0) return;

  const sugestao = atual[idx];
  atual[idx] = {
    ...sugestao,
    status: "aprovado",
    analisado_em: new Date().toISOString(),
    motivo_rejeicao: "",
  };
  salvarSugestoes(atual);

  const aprovados = getPatrimoniosAprovados();
  const slugBase = slugify(sugestao.nome);
  const slug = garantirSlugUnico(slugBase, [...PATRIMONIOS_MOCK, ...aprovados]);
  const novo: Patrimonio = {
    id: crypto.randomUUID(),
    slug,
    nome: sugestao.nome,
    descricao_historica: sugestao.descricao_historica,
    cidade: sugestao.cidade,
    categoria: sugestao.categoria ?? "Turístico",
    destaque: false,
    visitacao_aberta: true,
    referencias: sugestao.referencias,
    autor_nome: sugestao.criado_por_email,
    fotos: [{ url_imagem: sugestao.foto_url, legenda: sugestao.nome, e_principal: true }],
  };

  localStorage.setItem(STORAGE_APROVADOS, JSON.stringify([novo, ...aprovados]));
}

function garantirSlugUnico(base: string, lista: Patrimonio[]): string {
  let slug = base || "patrimonio";
  let count = 2;
  const slugs = new Set(lista.map((p) => p.slug));
  while (slugs.has(slug)) {
    slug = `${base}-${count}`;
    count += 1;
  }
  return slug;
}

export function rejeitarSugestao(id: string, motivo_rejeicao?: string) {
  const atual = getSugestoes();
  const idx = atual.findIndex((s) => s.id === id);
  if (idx < 0) return;
  atual[idx] = {
    ...atual[idx],
    status: "rejeitado",
    analisado_em: new Date().toISOString(),
    motivo_rejeicao: motivo_rejeicao?.trim() || "Não detalhado",
  };
  salvarSugestoes(atual);
}

export function getPatrimoniosAprovados(): Patrimonio[] {
  if (typeof window === "undefined") return [];
  return safeParse<Patrimonio[]>(localStorage.getItem(STORAGE_APROVADOS), []);
}

export function getPatrimoniosVisiveis(): Patrimonio[] {
  return [...PATRIMONIOS_MOCK, ...getPatrimoniosAprovados()];
}

