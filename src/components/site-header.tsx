"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Landmark, Search, Shield, ShieldCheck, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getSessao } from "@/lib/client-db";

const nav = [
  { href: "/", label: "Home", icon: Landmark },
  { href: "/busca-avancada", label: "Busca avançada", icon: Search },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [sessao, setSessao] = React.useState<any>(null);
  const [carregando, setCarregando] = React.useState(true);

  React.useEffect(() => {
    // Carrega a sessão atual de forma segura no lado do cliente
    setSessao(getSessao());
    setCarregando(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("usuario"); // ou como você limpa a sessão no client-db
    router.push("/login");
    router.refresh();
  };

  const isAdmin = Boolean(sessao?.isAdmin);
  const estaLogado = Boolean(sessao);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Landmark className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Acervo Rondoniense</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Patrimônio histórico, cultural e turístico
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900",
                  active &&
                    "bg-zinc-100 font-medium text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!carregando && (
            <>
              {/* Se for Admin, mostra o painel */}
              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                  <Link href="/admin/solicitacoes">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="hidden sm:inline">Painel Admin</span>
                  </Link>
                </Button>
              )}

              {/* Condicional dinâmica de Login / Logout */}
              {estaLogado ? (
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                  <Link href="/login">
                    <Shield className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </Button>
              )}
            </>
          )}

          <Button asChild className="md:hidden" size="icon" variant="outline">
            <Link href="/busca-avancada" aria-label="Busca avançada">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}