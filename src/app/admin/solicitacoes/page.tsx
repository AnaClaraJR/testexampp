"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldAlert, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADMIN_EMAIL, getSessao, type Sugestao } from "@/lib/client-db";
import { mapCategoriaIdToNome } from "@/lib/patrimonios";

// Interface para os dados brutos vindos da API do banco
interface SolicitacaoItemBanco {
  id: number | string;
  nome: string;
  descricao: string;
  localizacao: string;
  categoria_id?: number | string;
  categoria?: string;
  url_foto_principal?: string;
  referencias?: string;
  usuario_sugeriu: string;
  criado_em?: string;
  status?: string;
  destaque?: number | string | boolean;
}

export default function AdminSolicitacoesPage() {
  // CORREÇÃO ESLINT: Inicializa os estados de sessão de forma assíncrona/segura
  const [sessaoEmail, setSessaoEmail] = React.useState<string | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  const [sugestoes, setSugestoes] = React.useState<Sugestao[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Carrega os dados da sessão de forma que o ESLint não acuse renderizações síncronas em cascata
    function inicializarSessao() {
      const sessao = getSessao();
      if (sessao) {
        setSessaoEmail(sessao.email ?? null);
        setIsAdmin(Boolean(sessao.isAdmin));
      }
    }

    async function carregarSolicitacoes() {
      try {
        const resposta = await fetch("/api/solicitacoes");
        const dados = await resposta.json();
        if (!resposta.ok) {
          throw new Error(dados.error || "Erro ao carregar solicitações.");
        }
        
        // CORREÇÃO TYPESCRIPT: Mapeia garantindo a tipagem exata dos literais do status
        const listaMapeada = (dados as SolicitacaoItemBanco[]).map((item) => {
          // Garante que o status seja mapeado exatamente para um dos valores válidos
          let statusValidado: "pendente" | "aprovado" | "rejeitado" = "pendente";
          if (item.status === "aprovado" || item.status === "rejeitado") {
            statusValidado = item.status;
          }

          return {
            id: String(item.id),
            nome: item.nome,
            descricao_historica: item.descricao,
            cidade: item.localizacao,
            categoria: item.categoria || mapCategoriaIdToNome(item.categoria_id),
            categoria_id: item.categoria_id ? String(item.categoria_id) : "",
            foto_url: item.url_foto_principal || "",
            referencias: item.referencias || "",
            criado_by_email: item.usuario_sugeriu,
            criado_por_email: item.usuario_sugeriu,
            criado_em: item.criado_em || "",
            status: statusValidado, // Agora passa o tipo correto em vez de uma string genérica
            destaque: item.destaque === 1 || item.destaque === "1" || item.destaque === true,
          };
        });

        setSugestoes(listaMapeada);
      } catch (err) {
        console.error(err);
        const mensagem = err instanceof Error ? err.message : "Não foi possível carregar solicitações.";
        setError(mensagem);
      } finally {
        setLoading(false);
      }
    }

    inicializarSessao();
    carregarSolicitacoes();
  }, []);

  async function atualizarSolicitacao(
    id: string | number,
    payload: {
      action?: "aprovado" | "rejeitado" | "pendente";
      destaque?: boolean;
      motivo_rejeicao?: string;
    },
  ) {
    try {
      setError(null);

      if (!id) {
        throw new Error("O ID da solicitação não foi encontrado.");
      }

      const idFormatado = String(id).trim();
      const resposta = await fetch(`/api/solicitacoes/${idFormatado}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.error || "Não foi possível atualizar a solicitação.");
      }

      setSugestoes((prev) =>
        prev.map((item) =>
          item.id === String(id)
            ? {
                ...item,
                status: payload.action ?? item.status,
                destaque: payload.destaque ?? item.destaque,
                motivo_rejeicao:
                  payload.action === "rejeitado"
                    ? payload.motivo_rejeicao || "Recusado na curadoria."
                    : item.motivo_rejeicao,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Erro capturado no atualizarSolicitacao:", err);
      const mensagem = err instanceof Error ? err.message : "Falha ao atualizar solicitação.";
      setError(mensagem);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Carregando painel administrativo...</p>
        </div>
      </main>
    );
  }

  if (!sessaoEmail) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="pt-6 text-sm">
            Faça login para acessar esta área.
            <div className="mt-3">
              <Button asChild>
                <Link href="/login">Ir para Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="pt-6 text-sm">
            Acesso restrito. Apenas <strong>{ADMIN_EMAIL}</strong> pode aprovar/rejeitar sugestões.
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Painel de Solicitações</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Aprovar publica automaticamente o patrimônio na plataforma.
        </p>
      </header>

      {error ? (
        <Card className="mb-4">
          <CardContent className="pt-6 text-sm text-rose-700">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {sugestoes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-sm">Nenhuma sugestão enviada ainda.</CardContent>
          </Card>
        ) : (
          sugestoes.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle className="text-base">{s.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Cidade:</strong> {s.cidade}
                </div>
                {s.categoria ? (
                  <div>
                    <strong>Categoria:</strong> {s.categoria}
                  </div>
                ) : null}
                <div>
                  <strong>Descrição:</strong> {s.descricao_historica}
                </div>
                <div>
                  <strong>Foto cadastrada:</strong>{" "}
                  {s.foto_url ? (
                    <a className="underline text-blue-600 dark:text-blue-400 break-all" href={s.foto_url} target="_blank" rel="noreferrer">
                      {s.foto_url}
                    </a>
                  ) : (
                    <span className="text-zinc-400">Nenhuma URL de foto enviada</span>
                  )}
                </div>
                {s.referencias ? (
                  <div>
                    <strong>Referências:</strong> {s.referencias}
                  </div>
                ) : null}
                <div>
                  <strong>Status:</strong> <span className="capitalize font-medium">{s.status}</span>
                </div>
                
                {s.status === "pendente" ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button onClick={() => atualizarSolicitacao(s.id, { action: "aprovado" })}>
                      <CheckCircle2 className="h-4 w-4" /> Aprovar
                    </Button>
                    <Button variant="outline" onClick={() => atualizarSolicitacao(s.id, { action: "rejeitado" })}>
                      <XCircle className="h-4 w-4" /> Rejeitar
                    </Button>
                  </div>
                ) : s.status === "aprovado" ? (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" /> Publicado no acervo
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button variant="outline" onClick={() => atualizarSolicitacao(s.id, { action: "pendente" })}>
                        Reverter para pendente
                      </Button>
                      <Button
                        variant={s.destaque ? "default" : "outline"}
                        onClick={() => atualizarSolicitacao(s.id, { destaque: !s.destaque })}
                      >
                        {s.destaque ? "Remover destaque" : "Marcar destaque"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-1 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                      <ShieldAlert className="h-4 w-4" /> Rejeitado
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" onClick={() => atualizarSolicitacao(s.id, { action: "pendente" })}>
                        Reverter para pendente
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}