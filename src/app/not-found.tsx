import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
      <div className="max-w-xl space-y-3 text-center">
        <div className="text-6xl font-semibold tracking-tight">404</div>
        <h1 className="text-2xl font-semibold">Patrimônio não encontrado</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          O item solicitado não existe (ou ainda não foi aprovado/publicado).
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

