'use client';

import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ranges = ['3M', '6M', '1A'] as const;
type Range = (typeof ranges)[number];

export function FinancialGraph() {
    const [selectedRange, setSelectedRange] = useState<Range>('1A');
    const [fullData, setFullData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchFinancialData() {
            try {
                const response = await fetch('/response/api/financial-transaction', {
                    method: 'GET',
                    credentials: 'include',
                });

                const { data } = await response.json();
                const transactions = data?.transactions ?? [];

                const monthlyMap: Record<string, { total: number; year: number; monthIndex: number }> = {};

                transactions.forEach((t: any) => {
                    const d = new Date(t.transaction_date);
                    const year = d.getUTCFullYear();
                    const monthIndex = d.getUTCMonth();
                    const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

                    const amount = Number(t.amount); // normaliza
                    const value = t.type === 'EXPENSE' ? -Math.abs(amount) : Math.abs(amount);

                    if (!monthlyMap[key]) {
                        monthlyMap[key] = { total: 0, year, monthIndex };
                    }
                    monthlyMap[key].total += value;
                });

                // ordenação robusta por data real
                const monthlyData = Object.entries(monthlyMap)
                    .map(([key, v]) => {
                        const dateObj = new Date(Date.UTC(v.year, v.monthIndex, 1));
                        return {
                            key,
                            dateObj,
                            month: dateObj.toLocaleString('pt-BR', { month: 'short' }),
                            saldo: v.total,
                        };
                    })
                    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

                // acumulado
                let acumulado = 0;
                const accumulatedData = monthlyData.map((m) => {
                    acumulado += m.saldo;
                    return {
                        key: m.key,
                        month: m.month,
                        saldo: acumulado,
                    };
                });

                setFullData(accumulatedData);
            } catch (error) {
                console.error('Error fetching financial data:', error);
            }
        }

        fetchFinancialData();
    }, []);

    // filtra os dados conforme range
    const filteredData = useMemo(() => {
        if (selectedRange === '3M') return fullData.slice(-3);
        if (selectedRange === '6M') return fullData.slice(-6);
        return fullData;
    }, [selectedRange, fullData]);

    // domain do Y — não forço min >= 0 (isso escondia saldos negativos)
    const yDomain = useMemo(() => {
        if (filteredData.length === 0) return [0, 1];
        const values = filteredData.map((d) => d.saldo);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = Math.max(1000, Math.round((max - min) * 0.08));
        return [min - padding, max + padding];
    }, [filteredData]);

    const moneyFormatter = (value: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
        }).format(value);

    return (
        <Card className="p-5 rounded-2xl shadow-md border border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">Evolução do Saldo</CardTitle>

                <div className="flex items-center gap-2 text-sm">
                    {ranges.map((range) => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            aria-pressed={selectedRange === range}
                            className={cn(
                                'px-2 py-0.5 rounded-md font-medium transition-all duration-150',
                                selectedRange === range
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="pt-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredData} key={selectedRange}>
                            <defs>
                                <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E6E9EE" />

                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                interval={0}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                tickFormatter={(v) => `${v / 1000}k`}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                domain={yDomain as any}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255,255,255,0.98)',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: 8,
                                    boxShadow: '0 6px 18px rgba(12, 14, 20, 0.06)',
                                    padding: '8px 10px',
                                }}
                                labelStyle={{ color: '#374151', fontWeight: 600 }}
                                formatter={(v: any) => moneyFormatter(Number(v))}
                            />

                            <Area
                                key={`area-${selectedRange}`}
                                type="monotone"
                                dataKey="saldo"
                                stroke="#10B981"
                                strokeWidth={2.5}
                                fill="url(#saldoGradient)"
                                isAnimationActive={true}
                                animationDuration={600}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
