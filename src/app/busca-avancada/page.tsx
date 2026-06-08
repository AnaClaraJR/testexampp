"use client";

import * as React from "react";
import { Filter, Search, X } from "lucide-react";

import {
  CATEGORIAS,
  CIDADES_RONDONIA,
  ESTADOS_CONSERVACAO,
  filtrarPatrimonios,
  normalizarPatrimonioRow,
  type BuscaAvancadaFiltro,
  type Patrimonio,
} from "@/lib/patrimonios";
import { PatrimonioCard } from "@/components/patrimonio-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuscaAvancadaPage() {
  const [patrimonios, setPatrimonios] = React.useState<Patrimonio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filtro, setFiltro] = React.useState<BuscaAvancadaFiltro>({
    q: "",
    cidade: "",
    categoria: "",
    estado_conservacao: "",
    visitacao_aberta: "",
    destaque: "",
  });

  const resultados = React.useMemo(
    () => filtrarPatrimonios(patrimonios, filtro),
    [filtro, patrimonios],
  );

  async function carregarPatrimonios() {
    setLoading(true);
    try {
      const resposta = await fetch("/api/patrimonios");
      const dados = await resposta.json();
      if (resposta.ok && Array.isArray(dados)) {
        setPatrimonios(dados.map((item) => normalizarPatrimonioRow(item as Record<string, unknown>) as Patrimonio));
      } else {
        console.error("Falha ao carregar patrimonios:", dados);
      }
    } catch (error: unknown) {
      console.error("Erro ao buscar patrimonios:", error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregarPatrimonios();
  }, []);

  const chips = React.useMemo(() => {
    const out: { key: keyof BuscaAvancadaFiltro; label: string }[] = [];
    if (filtro.cidade) out.push({ key: "cidade", label: `Cidade: ${filtro.cidade}` });
    if (filtro.categoria)
      out.push({ key: "categoria", label: `Categoria: ${filtro.categoria}` });
    if (filtro.estado_conservacao)
      out.push({
        key: "estado_conservacao",
        label: `Conservação: ${filtro.estado_conservacao}`,
      });
    if (filtro.visitacao_aberta)
      out.push({
        key: "visitacao_aberta",
        label: `Visitação: ${filtro.visitacao_aberta === "sim" ? "Aberta" : "Fechada"}`,
      });
    if (filtro.destaque)
      out.push({
        key: "destaque",
        label: `Destaque: ${filtro.destaque === "sim" ? "Sim" : "Não"}`,
      });
    return out;
  }, [filtro]);

  function limparTudo() {
    setFiltro({
      q: "",
      cidade: "",
      categoria: "",
      estado_conservacao: "",
      visitacao_aberta: "",
      destaque: "",
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <Filter className="h-5 w-5" />
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Busca avançada
            </h1>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Refine por cidade, categoria e outros critérios. Clique em um card para
            abrir o detalhe do patrimônio.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" /> Filtros
            </CardTitle>
            <CardDescription>
              Os resultados são atualizados automaticamente com dados vindos do MariaDB/XAMPP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Texto</div>
                <Input
                  value={filtro.q ?? ""}
                  onChange={(e) => setFiltro((s) => ({ ...s, q: e.target.value }))}
                  placeholder="Nome, cidade, descrição..."
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Cidade</div>
                <select
                  value={filtro.cidade ?? ""}
                  onChange={(e) => setFiltro((s) => ({ ...s, cidade: e.target.value }))}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="">Todas</option>
                  {CIDADES_RONDONIA.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Categoria</div>
                <select
                  value={filtro.categoria ?? ""}
                  onChange={(e) => setFiltro((s) => ({ ...s, categoria: e.target.value }))}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="">Todas</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Estado de conservação</div>
                <select
                  value={filtro.estado_conservacao ?? ""}
                  onChange={(e) =>
                    setFiltro((s) => ({ ...s, estado_conservacao: e.target.value }))
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="">Qualquer</option>
                  {ESTADOS_CONSERVACAO.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Visitação aberta</div>
                <select
                  value={filtro.visitacao_aberta ?? ""}
                  onChange={(e) =>
                    setFiltro((s) => ({
                      ...s,
                      visitacao_aberta: e.target.value as BuscaAvancadaFiltro["visitacao_aberta"],
                    }))
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="">Qualquer</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Somente destaques</div>
                <select
                  value={filtro.destaque ?? ""}
                  onChange={(e) =>
                    setFiltro((s) => ({
                      ...s,
                      destaque: e.target.value as BuscaAvancadaFiltro["destaque"],
                    }))
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="">Tanto faz</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <Badge key={c.key} variant="outline" className="gap-2">
                  {c.label}
                  <button
                    className="rounded-full p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    onClick={() => setFiltro((s) => ({ ...s, [c.key]: "" }))}
                    aria-label={`Remover filtro ${c.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" onClick={limparTudo}>
                  Limpar
                </Button>
                <Button onClick={carregarPatrimonios}>
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Resultados</h2>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {loading ? "Carregando resultados..." : `${resultados.length} encontrado(s)`}
            </div>
          </div>

          {loading ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              Carregando dados do servidor...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((item) => (
                <PatrimonioCard key={String(item.id)} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

