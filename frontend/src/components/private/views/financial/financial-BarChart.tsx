'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
    total: {
        label: 'Total',
        color: '#EF4444',
    },
} satisfies ChartConfig;

export default function FinancialBarChart() {
    const [chartData, setChartData] = useState([]);
    const [totalYear, setTotalYear] = useState(0);

    useEffect(() => {
        async function loadData() {
            const res = await fetch('/response/api/financial-transaction?type=EXPENSE');
            const json = await res.json();

            const transactions = json.data.transactions || [];

            const grouped: Record<string, number> = {};
            let yearlyTotal = 0;

            transactions.forEach((t: any) => {
                if (t.type !== 'EXPENSE') return;

                const date = new Date(t.transaction_date);
                const month = date.toLocaleDateString('pt-BR', { month: 'short' });

                const amount = Number(t.amount);
                yearlyTotal += amount;

                if (!grouped[month]) grouped[month] = 0;
                grouped[month] += amount;
            });

            const result = Object.entries(grouped).map(([month, total]) => ({
                month: month.charAt(0).toUpperCase() + month.slice(1, 3),
                total,
            }));

            setChartData(result as any);
            setTotalYear(yearlyTotal);
        }

        loadData();
    }, []);

    return (
        <Card className="w-1/2">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Comparativo de Despesas</CardTitle>
                    <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
                        Ver detalhes
                        <span className="text-lg">→</span>
                    </button>
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="0" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} className="text-sm" />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            className="text-sm"
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="total" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={80} />
                    </BarChart>
                </ChartContainer>

                <div className="mt-8 p-4 border rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Gasto total do Ano</div>
                    <div className="text-3xl font-semibold mb-1">R$ {totalYear.toLocaleString('pt-BR')}</div>
                </div>
            </CardContent>
        </Card>
    );
}
