'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

export function ChartBarInteractive() {
	const [chartData, setChartData] = useState([]);

	// -------------------------------
	// 1 - Busca da API
	// -------------------------------
	async function loadData() {
		try {
			const res = await fetch(
				'/response/api/financial-transaction?page=1&limit=200',
				{
					method: 'GET',
					credentials: 'include',
				}
			);
			const json = await res.json();

			console.log(json);
			if (!json.success) return;

			const transactions = json.data.transactions;

			// -------------------------------
			// 2 - Agrupar por data somando os amounts
			// -------------------------------
			const grouped: Record<string, number> = {};

			transactions.forEach((t: any) => {
				const d = t.transaction_date.split('T')[0]; // yyyy-mm-dd
				const value = Number(t.amount);

				if (!grouped[d]) grouped[d] = 0;
				grouped[d] += value;
			});

			// -------------------------------
			// 3 - Transformar no formato do Recharts
			// -------------------------------
			const finalData = Object.entries(grouped).map(([date, amount]) => ({
				date,
				total: amount,
			}));

			setChartData(finalData as any);
		} catch (err) {
			console.error('Erro ao carregar transações:', err);
		}
	}

	useEffect(() => {
		loadData();
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Transações Financeiras</CardTitle>
				<CardDescription>Total por dia</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer
					config={{
						total: {
							label: 'Total',
							color: 'hsl(var(--chart-1))',
						},
					}}
					className="h-[350px]"
				>
					<BarChart data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							fontSize={12}
						/>

						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>

						<Bar dataKey="total" radius={4} fill="red" />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
