"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Out", total: 11500 },
  { month: "Nov", total: 12000 },
  { month: "Dez", total: 12300 },
]

const chartConfig = {
  total: {
    label: "Total",
    color: "#EF4444",
  },
} satisfies ChartConfig

export default function FinancialBarChart() {
  const gastosFixos = 7200
  const gastosVariaveis = 5140
  const totalGastos = gastosFixos + gastosVariaveis

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
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-sm"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000]}
              className="text-sm"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar 
              dataKey="total" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <div>
            <div className="text-sm text-gray-600 mb-1">Gastos Fixos</div>
            <div className="text-2xl font-semibold mb-1">R$ {gastosFixos.toLocaleString('pt-BR')}</div>
            <div className="text-sm text-gray-500">
              {Math.round((gastosFixos / totalGastos) * 100)}% do total
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Gastos Variáveis</div>
            <div className="text-2xl font-semibold mb-1">R$ {gastosVariaveis.toLocaleString('pt-BR')}</div>
            <div className="text-sm text-gray-500">
              {Math.round((gastosVariaveis / totalGastos) * 100)}% do total
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}