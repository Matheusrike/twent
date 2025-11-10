"use client"

import * as React from "react"
import { Package, TrendingUp, AlertCircle } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export const description = "Gráfico de estoque em formato donut"

// stock data
const stockData = {
  current: 900,
  total: 1000,
}

const CHART_COLOR_ATUAL = "#de1a26"
const CHART_COLOR_DISPONIVEL = "#e5e7eb"

const chartData = [
  {
    category: "atual",
    quantity: stockData.current,
    fill: CHART_COLOR_ATUAL,
  },
  {
    category: "disponivel",
    quantity: stockData.total - stockData.current,
    fill: CHART_COLOR_DISPONIVEL,
  },
]

const chartConfig = {
  quantity: {
    label: "Quantidade",
  },
  atual: {
    label: "Estoque Atual",
    color: CHART_COLOR_ATUAL,
  },
  disponivel: {
    label: "Capacidade Disponível",
    color: CHART_COLOR_DISPONIVEL,
  },
} satisfies ChartConfig

export function StockDonutChart() {
  const percentage = React.useMemo(() => {
    return ((stockData.current / stockData.total) * 100).toFixed(1)
  }, [])

  const stockStatus =
    parseFloat(percentage) > 80
      ? "high"
      : parseFloat(percentage) > 50
      ? "medium"
      : "low"

  return (
    <Card className="flex flex-col h-full">
      {/*  status */}
      <CardHeader className="pb-4 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Estoque Total</CardTitle>

          {stockStatus === "high" && (
             <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
             <Package className="h-3.5 w-3.5" />
             Estoque Alto
           </div>
          )}
          {stockStatus === "medium" && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" />
              Estoque Normal
            </div>
          )}
          {stockStatus === "low" && (
         
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            <AlertCircle className="h-3.5 w-3.5" />
            Estoque Baixo
          </div>
          )}
        </div>

        <CardDescription className="text-sm text-muted-foreground">
          Monitoramento em tempo real
        </CardDescription>
      </CardHeader>

      {/* stock graph content */}
      <CardContent className="flex items-center justify-center ">
        {/* data info */}
        <div className="flex md:flex-col gap-4 md:w-0 ">
          <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Atual
            </span>
            <span className="text-2xl font-bold text-foreground">
              {stockData.current.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">unidades</span>
          </div>

          <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total
            </span>
            <span className="text-2xl font-bold text-foreground">
              {stockData.total.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">unidades</span>
          </div>
        </div>

        {/* stock graph */}
        <ChartContainer
          config={chartConfig}
          className=" hidden md:flex flex-1 mx-auto aspect-square max-h-[250px] "
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="quantity"
              nameKey="category"
              innerRadius={70}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
