'use client';

import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Crown, Store } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export default function SalesRankingCard() {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('http://localhost:3333/api/store', {
                    method: 'GET',
                    credentials: 'include',
                }); 
                const json = await res.json();

                if (!json.data) return;

                const formatted = json.data
                    .map((store: any) => ({
                        id: store.id,
                        name: store.name,
                        type: store.type,
                        revenue: Number(store.sales?.[0]?.total || 0),
                    }))
                    .sort((a: any, b: any) => b.revenue - a.revenue)
                    .slice(0, 3)
                    .map((store: any, index: any) => ({
                        ...store,
                        rank: index + 1,
                    }));

                setStores(formatted);
                console.log("lojas carregadas: ",stores)
            } catch (err) {
                console.error('Erro ao carregar lojas', err);
            }
        }

        load();
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
        if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
        if (rank === 3) return <Trophy className="h-5 w-5 text-orange-500" />;
        return <span className="text-muted-foreground font-semibold">#{rank}</span>;
    };

    const formatRevenue = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Card className="w-full shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Trophy className="h-6 w-6 text-primary" />
                                Ranking de Vendas
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">Top 3 lojas por faturamento</p>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Período</p>
                            <p className="text-sm font-semibold">2025</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="divide-y">
                        {stores.map((store: any, index: any) => (
                            <div
                                key={store.id}
                                className={`px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 transition-colors ${
                                    index === 0 ? 'bg-yellow-50/50 dark:bg-yellow-950/20' : ''
                                }`}
                            >
                                <Item className="w-full p-0 gap-3">
                                    <div className="flex items-center justify-center w-8">
                                        {getRankIcon(store.rank)}
                                    </div>

                                    <ItemMedia>
                                        <div className="h-12 w-12 rounded-full bg-primary/80 flex items-center justify-center text-white">
                                            <Store className="h-5 w-5" />
                                        </div>
                                    </ItemMedia>

                                    <ItemContent className="gap-0 flex-1 min-w-0">
                                        <ItemTitle className="text-sm sm:text-base truncate">{store.name}</ItemTitle>
                                        <ItemDescription className="text-xs">{store.type}</ItemDescription>
                                    </ItemContent>

                                    <div className="text-right min-w-[90px]">
                                        <div className="font-bold text-base">{formatRevenue(store.revenue)}</div>
                                    </div>

                                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                </Item>
                            </div>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="h-0.5" />
            </Card>
        </div>
    );
}
