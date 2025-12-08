'use client';

import { useEffect, useState, useMemo } from 'react';
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Transaction = {
    id: string;
    category: string;
    amount: string;
    type: string;
};

export function FinancialPieChart() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        async function load() {
            const res = await fetch('/response/api/financial-transaction?type=EXPENSE');
            const json = await res.json();
            if (json?.data?.transactions) {
                setTransactions(json.data.transactions);
            }
        }
        load();
    }, []);

    const data = useMemo(() => {
        if (!transactions.length) return [];

        const map = new Map<string, number>();

        transactions.forEach((t) => {
            const value = Number(t.amount);
            map.set(t.category, (map.get(t.category) || 0) + value);
        });

        const colors = ['#F44336', '#FF9800', '#FFC107', '#4CAF50', '#8BC34A'];

        return Array.from(map.entries()).map(([name, value], i) => ({
            name,
            value,
            color: colors[i % colors.length],
        }));
    }, [transactions]);

    const sortedLegend = useMemo(() => [...data].sort((a, b) => b.value - a.value).slice(0, 5), [data]);

    return (
        <Card className="w-1/2 mx-auto shadow-md rounded-xl bg-white">
            <CardHeader className="pb-2 text-center">
                <CardTitle className="text-base font-semibold text-gray-800">Despesas por Categoria</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center w-full p-0">
                <div className="w-[220px] h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                stroke="none"
                                startAngle={90}
                                endAngle={450}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 text-sm w-full max-w-xs text-gray-700">
                    <p className="font-semibold mb-2 text-center text-gray-800">Top 5 Maiores Gastos</p>
                    <ul className="space-y-1">
                        {sortedLegend.map((item) => (
                            <li key={item.name} className="flex justify-between">
                                <span>{item.name}</span>
                                <span>R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
