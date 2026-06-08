import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mapCategoriaIdToNome } from "@/lib/patrimonios";

// Ajustamos a tipagem para aceitar tanto a estrutura antiga quanto as colunas do MariaDB
interface PatrimonioCardProps {
  item: {
    id: number | string;
    nome: string;
    slug: string;
    cidade: string;
    bairro?: string;
    descricao_historica?: string;
    descricao?: string; // Mapeamento da coluna do MariaDB
    categoria?: string;
    categoria_id?: number | string;
    destaque?: boolean | number | string;
    url_foto_principal?: string; // Mapeamento direto da tabela pontos_turisticos
    fotos?: Array<{ url_imagem: string; legenda?: string; e_principal?: boolean | number }>;
  };
}

export function PatrimonioCard({ item }: PatrimonioCardProps) {
  // SISTEMA DE SEGURANÇA PARA A FOTO:
  // 1. Tenta buscar a foto marcada como principal na tabela galeria_fotos
  // 2. Se não achar, pega a primeira foto da galeria_fotos
  // 3. Se a galeria estiver vazia, usa a url_foto_principal gravada direto na tabela pontos_turisticos!
  const categoriaExibicao = item.categoria || mapCategoriaIdToNome(item.categoria_id);
  const fotoUrl = 
    item.fotos?.find((f) => f.e_principal)?.url_imagem || 
    item.fotos?.[0]?.url_imagem || 
    item.url_foto_principal;

  const fotoLegenda = item.fotos?.find((f) => f.e_principal)?.legenda || item.nome;
  
  // Normaliza o campo de descrição para evitar textos vazios nos cards
  const resumoDescricao = item.descricao_historica || item.descricao;

  return (
    <Link href={`/patrimonios/${item.slug}`} className="block">
      <Card className="overflow-hidden transition hover:shadow-md">
        {/* Atualizado de aspect-[16/10] para aspect-16/10 eliminando o aviso do Tailwind */}
        <div className="relative aspect-16/10 w-full bg-zinc-100 dark:bg-zinc-900">
          {fotoUrl ? (
            <Image
              src={fotoUrl}
              alt={fotoLegenda}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={Number(item.destaque) === 1}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
              Sem imagem cadastrada
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            {Number(item.destaque) === 1 ? <Badge variant="default">Destaque</Badge> : null}
            {categoriaExibicao ? <Badge variant="secondary">{categoriaExibicao}</Badge> : null}
          </div>
        </div>

        <CardContent className="space-y-2 pt-4">
          <div className="line-clamp-2 text-base font-semibold leading-snug">
            {item.nome}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <MapPin className="h-4 w-4" />
            <span>
              {item.cidade}
              {item.bairro ? ` • ${item.bairro}` : ""}
            </span>
          </div>
          {resumoDescricao ? (
            <p className="line-clamp-3 text-sm text-zinc-700 dark:text-zinc-300">
              {resumoDescricao}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}