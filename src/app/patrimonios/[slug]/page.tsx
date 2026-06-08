"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mapCategoriaIdToNome } from "@/lib/patrimonios";

interface PontoTuristico {
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
  destaque?: boolean | number;
  estado_conservacao?: string;
  classificacao?: string;
  autor_nome?: string;
  website_oficial?: string;
  referencias?: string;
  fotos?: Array<{ url_imagem: string; legenda?: string; e_principal?: boolean | number }>;
}

export default function PatrimonioDetalhePage() {
  const params = useParams<{ slug: string }>();
  const [item, setItem] = React.useState<PontoTuristico | null>(null);
  const [carregando, setCarregando] = React.useState(true);

  React.useEffect(() => {
    if (!params.slug) return;

    fetch(`/api/patrimonios/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Não encontrado");
        return res.json();
      })
      .then((dados) => {
        if (dados && !dados.error) {
          setItem(dados);
        }
      })
      .catch((err) => console.error("Erro ao buscar patrimônio do banco:", err))
      .finally(() => setCarregando(false));
  }, [params.slug]);

  if (carregando) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Carregando dados históricos...</p>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
        <div className="max-w-xl space-y-3 text-center">
          <div className="text-6xl font-semibold tracking-tight">404</div>
          <h1 className="text-2xl font-semibold">Patrimônio não encontrado</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            O item solicitado não existe no banco de dados (ou ainda não foi aprovado pela administração).
          </p>
          <div className="flex justify-center pt-2">
            <Button asChild variant="outline">
              <Link href="/busca-avancada">
                <ArrowLeft className="h-4 w-4" />
                Voltar para a busca
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const fotoUrl = item.url_foto_principal || item.fotos?.find((f) => f.e_principal)?.url_imagem || item.fotos?.[0]?.url_imagem;
  const fotoLegenda = item.fotos?.find((f) => f.e_principal)?.legenda || item.nome;
  const descricaoExibida = item.descricao || item.descricao_historica;
  const categoriaNome = mapCategoriaIdToNome(item.categoria ?? item.categoria_id);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline">
          <Link href="/busca-avancada">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {item.destaque ? <Badge variant="default">Destaque</Badge> : null}
          {item.estado_conservacao ? <Badge variant="outline">{item.estado_conservacao}</Badge> : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">{item.nome}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="h-4 w-4" />
              <span>
                {item.cidade}
                {item.bairro ? ` • ${item.bairro}` : ""}
                {item.endereco ? ` • ${item.endereco}` : ""}
              </span>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="relative aspect-16/10 w-full">
              {fotoUrl ? (
                <Image
                  src={fotoUrl}
                  alt={fotoLegenda}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-400 text-sm">
                  Nenhuma imagem disponível para este patrimônio
                </div>
              )}
            </div>
          </div>

          {descricaoExibida ? (
            <div className="mt-6">
              <div className="text-sm font-semibold">Descrição histórica</div>
              <p className="mt-1 leading-relaxed text-zinc-700 dark:text-zinc-300 text-justify whitespace-pre-line">
                {descricaoExibida}
              </p>
            </div>
          ) : null}
        </section>

        <aside className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardContent className="space-y-4 pt-6">
              <div>
                <div className="text-sm font-semibold">Informações</div>
                <div className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {categoriaNome ? (
                    <div>
                      <span className="font-medium">Categoria:</span> {categoriaNome}
                    </div>
                  ) : null}
                  {item.classificacao ? (
                    <div>
                      <span className="font-medium">Classificação:</span> {item.classificacao}
                    </div>
                  ) : null}
                  {item.autor_nome ? (
                    <div>
                      <span className="font-medium">Autor/colaborador:</span> {item.autor_nome}
                    </div>
                  ) : null}
                  {item.referencias ? (
                    <div>
                      <span className="font-medium">Referências:</span> {item.referencias}
                    </div>
                  ) : null}
                  {item.website_oficial ? (
                    <div>
                      <span className="font-medium">Website:</span>{" "}
                      <a
                        href={item.website_oficial}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 underline underline-offset-4 text-blue-600 dark:text-blue-400"
                      >
                        Acessar <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}