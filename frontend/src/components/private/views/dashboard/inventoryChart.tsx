'use client';

import * as React from 'react';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

const CHART_COLOR_ATUAL = '#de1a26';
const CHART_COLOR_DISPONIVEL = '#e5e7eb';

export function StockDonutChart() {
    const [filiais, setFiliais] = React.useState([]);
    const [selected, setSelected] = React.useState(0);

    // --- Carrega dados da API ---
    React.useEffect(() => {
        async function load() {
            try {
                const res = await fetch('http://localhost:3333/api/inventory/all', {
                    method: 'GET',
                    credentials: 'include',
                }); // ajustar para sua rota real
                const json = await res.json();
                console.log('Inventário carregado:', json);
                setFiliais(json.data);
            } catch (err) {
                console.error('Erro ao carregar inventário:', err);
            }
        }
        load();
    }, []);

    // --- Enquanto carrega ---
    if (filiais.length === 0) {
        return (
            <Card className="p-6">
                <p>Carregando inventário...</p>
            </Card>
        );
    }

    const filial: any = filiais[selected];
    const items = filial.inventory ?? [];

    // Soma total do estoque da filial
    const stockCurrent = items.reduce((acc: any, item: any) => acc + item.quantity, 0);

    // Aqui estou definindo o "total" como a soma do mínimo requerido
    // Se quiser outra lógica, me fale.
    const stockTotal = items.reduce((acc: any, item: any) => acc + Math.max(item.quantity, item.minimum_stock), 0);

    const percentage = stockTotal > 0 ? ((stockCurrent / stockTotal) * 100).toFixed(1) : '0';

    const chartData = [
        {
            category: 'atual',
            quantity: stockCurrent,
            fill: CHART_COLOR_ATUAL,
        },
        {
            category: 'disponivel',
            quantity: Math.max(stockTotal - stockCurrent, 0),
            fill: CHART_COLOR_DISPONIVEL,
        },
    ];

    const chartConfig = {
        quantity: { label: 'Quantidade' },
        atual: { label: 'Atual', color: CHART_COLOR_ATUAL },
        disponivel: { label: 'Disponível', color: CHART_COLOR_DISPONIVEL },
    } satisfies ChartConfig;

    const pctNum = parseFloat(percentage);

    const stockStatus = pctNum > 80 ? 'high' : pctNum > 50 ? 'medium' : 'low';

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className=" space-y-1">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Estoque — {filial.name}</CardTitle>

                    <select
                        className="border rounded-md px-2  text-sm"
                        value={selected}
                        onChange={(e) => setSelected(Number(e.target.value))}
                    >
                        {filiais.map((f: any, i) => (
                            <option key={i} value={i}>
                                {f.name}
                            </option>
                        ))}
                    </select>
                </div>

                {stockStatus === 'high' && (
                    <div className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit flex gap-1.5">
                        <Package className="h-3.5 w-3.5" />
                        Estoque Alto
                    </div>
                )}
                {stockStatus === 'medium' && (
                    <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full w-fit flex gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Estoque Normal
                    </div>
                )}
                {stockStatus === 'low' && (
                    <div className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full w-fit flex gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Estoque Baixo
                    </div>
                )}

                <CardDescription className="text-sm text-muted-foreground">
                    Monitoramento do estoque da filial selecionada
                </CardDescription>
            </CardHeader>

            <CardContent className="flex items-center justify-center ">
                {/* info */}
                <div className="flex md:flex-col gap-4 md:w-0 ">
                    <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Atual</span>
                        <span className="text-2xl font-bold text-foreground">{stockCurrent}</span>
                        <span className="text-xs text-muted-foreground">unidades</span>
                    </div>

                    <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</span>
                        <span className="text-2xl font-bold text-foreground">{stockTotal}</span>
                        <span className="text-xs text-muted-foreground">unidades</span>
                    </div>
                </div>

                {/* gráfico */}
                <ChartContainer
                    config={chartConfig}
                    className="hidden md:flex flex-1 mx-auto aspect-square max-h-[200px]"
                >
                    <PieChart>
                        <Pie data={chartData} dataKey="quantity" innerRadius={70} startAngle={90} endAngle={-270}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {percentage}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    do estoque
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
