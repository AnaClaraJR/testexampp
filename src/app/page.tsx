"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { PatrimonioCard } from "@/components/patrimonio-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizarPatrimonioRow } from "@/lib/patrimonios";

export default function HomePage() {
  const [patrimonios, setPatrimonios] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const destaques = patrimonios.filter((p) => p.destaque).slice(0, 6);

  React.useEffect(() => {
    async function carregarPatrimonios() {
      try {
        const resposta = await fetch("/api/patrimonios");
        const dados = await resposta.json();
        if (resposta.ok) {
          setPatrimonios((dados as any[]).map(normalizarPatrimonioRow));
        } else {
          console.error("Falha ao carregar patrimonios:", dados);
        }
      } catch (error) {
        console.error("Erro ao buscar patrimonios:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarPatrimonios();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-linear-to-br from-zinc-50 to-white p-8 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-950">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Acervo Rondoniense
          </h1>
          <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            Plataforma de catalogação, preservação e difusão do patrimônio
            histórico, cultural e turístico do estado de Rondônia, com colaboração
            comunitária e curadoria administrativa.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full max-w-lg items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <Search className="ml-2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar por nome, cidade, categoria..."
                className="border-0 shadow-none focus-visible:ring-0"
              />
              <Button asChild className="rounded-lg">
                <Link href="/busca-avancada">
                  Buscar <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Button asChild variant="outline">
              <Link href="/busca-avancada">Abrir filtros avançados</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Destaques</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Pontos em evidência para explorar primeiro.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/busca-avancada">
              Ver tudo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((item) => (
            <PatrimonioCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

