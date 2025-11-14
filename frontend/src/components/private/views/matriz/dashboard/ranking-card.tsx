import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Trophy, TrendingUp, Star, Crown, Store } from "lucide-react";
import { useState } from "react";

export default function SalesRankingCard() {
  const [salesData] = useState([
    {
      id: 1,
      name: "Loja1",
      username: "@ana.silva",
      sales: 147,
      revenue: "R$ 89.500",
      growth: "+23%",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      rank: 1,
    },
    {
      id: 2,
      name: "Loja2",
      username: "@carlos.m",
      sales: 132,
      revenue: "R$ 78.200",
      growth: "+18%",
      color: "bg-gradient-to-br from-gray-300 to-gray-500",
      rank: 2,
    },
    {
      id: 3,
      name: "Loja3",
      username: "@bia.costa",
      sales: 121,
      revenue: "R$ 72.800",
      growth: "+15%",
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
      rank: 3,
    },
  ]);

  const getRankIcon = (rank: any) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-orange-500" />;
    return <span className="text-muted-foreground font-semibold">#{rank}</span>;
  };

  return (
    <div className="w-full max-w-5xl mx-auto ">
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Ranking de Vendas
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Top 3 vendedores do mês
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Período</p>
              <p className="text-sm font-semibold">Outubro 2025</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y">
            {salesData.map((seller, index) => (
              <div
                key={seller.id}
                className={`px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 transition-colors ${
                  index === 0 ? "bg-yellow-50/50 dark:bg-yellow-950/20" : ""
                }`}
              >
                <Item className="w-full p-0 gap-2 sm:gap-3 ">
                  <div className="flex items-center justify-center w-6 sm:w-8">
                    {getRankIcon(seller.rank)}
                  </div>

                  <ItemMedia>
                    <div
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full ${seller.color} flex items-center justify-center text-white font-bold text-xs sm:text-sm`}
                    >
                      <Store />
                    </div>
                  </ItemMedia>

                  <ItemContent className="gap-0 flex-1 min-w-0">
                    <ItemTitle className="text-sm sm:text-base truncate">
                      {seller.name}
                    </ItemTitle>
                    <ItemDescription className="text-xs hidden sm:block">
                      {seller.username}
                    </ItemDescription>
                  </ItemContent>

                  <div className="text-right">
                    <div className="font-bold text-base">{seller.revenue}</div>
                    <div className="text-xs text-muted-foreground">
                      {seller.sales} vendas
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold min-w-[60px] justify-end">
                    <TrendingUp className="h-4 w-4" />
                    {seller.growth}
                  </div>
                </Item>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="h-0.5"></CardFooter>
      </Card>
    </div>
  );
}
