import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  totalPast: number;
  totalFuture: number;
}

export function SectionCards({ totalPast, totalFuture }: SectionCardsProps) {
  const formatBRL = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="xl:grid-cols-2 5xl:grid-cols-4  grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      {/* Faturamento Realizado */}
      <Card className="@container/card bg-transparent text-white border border-white/10">
        <CardHeader className="relative">
          <CardDescription className="text-white">
            Faturamento Realizado
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatBRL(totalPast)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className="flex gap-1 rounded-lg text-xs border-none text-green-600 bg-green-500/20"
            >
              <TrendingUpIcon className="size-3" />
              +R$
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Lucro acumulado <TrendingUpIcon className="size-4 text-green-500" />
          </div>
          <div className="text-white">
            Somatória dos agendamentos anteriores a hoje
          </div>
        </CardFooter>
      </Card>

      {/* Previsão de Faturamento */}
      <Card className="@container/card bg-transparent text-white border border-white/10">
        <CardHeader className="relative">
          <CardDescription className="text-white">
            Previsão de Faturamento
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatBRL(totalFuture)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className="flex gap-1 rounded-lg text-xs text-blue-600 bg-blue-500/20 border-none"
            >
              <TrendingUpIcon className="size-3" />
              Prev.
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Agendamentos futuros{" "}
            <TrendingUpIcon className="size-4 text-blue-500" />
          </div>
          <div className="text-white">
            Baseado nos serviços agendados após hoje
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
