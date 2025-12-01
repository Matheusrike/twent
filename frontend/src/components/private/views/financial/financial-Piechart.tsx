"use client"

import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Aluguel", value: 3500, color: "#F44336" },
  { name: "Alimentação", value: 2800, color: "#FF9800" },
  { name: "Transporte", value: 1500, color: "#FFC107" },
  { name: "Lazer", value: 1840, color: "#4CAF50" },
  { name: "Contas", value: 1200, color: "#8BC34A" },
]

export function FinancialPieChart() {
  return (
    <Card className="w-1/2 mx-auto shadow-md rounded-xl bg-white">
      {/* Título */}
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-base font-semibold text-gray-800">
          Despesas por Categoria
        </CardTitle>
      </CardHeader>

      {/* Gráfico */}
      <CardContent className="flex flex-col items-center justify-center w-full p-0">
        <div className="w-[220px] h-[220px]">
          <ResponsiveContainer>
            <PieChart>
              <Tooltip
                formatter={(value: number) =>
                  `R$ ${value.toLocaleString("pt-BR")}`
                }
              />
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="mt-4 text-sm w-full max-w-xs text-gray-700">
          <p className="font-semibold mb-2 text-center text-gray-800">
            Top 5 Maiores Gastos
          </p>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span>Aluguel</span>
              <span>R$ 3.500</span>
            </li>
            <li className="flex justify-between">
              <span>Alimentação</span>
              <span>R$ 2.800</span>
            </li>
            <li className="flex justify-between">
              <span>Transporte</span>
              <span>R$ 1.500</span>
            </li>
            <li className="flex justify-between text-red-500 font-medium">
              <span>Lazer</span>
              <span>R$ 1.840</span>
            </li>
            <li className="flex justify-between">
              <span>Contas</span>
              <span>R$ 1.200</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
