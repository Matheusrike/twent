"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// dados completos (12 meses)
const fullData = [
  { month: "Jan", saldo: 32000 },
  { month: "Fev", saldo: 38000 },
  { month: "Mar", saldo: 40000 },
  { month: "Abr", saldo: 42000 },
  { month: "Mai", saldo: 44000 },
  { month: "Jun", saldo: 45000 },
  { month: "Jul", saldo: 45500 },
  { month: "Ago", saldo: 46000 },
  { month: "Set", saldo: 46500 },
  { month: "Out", saldo: 47000 },
  { month: "Nov", saldo: 47500 },
  { month: "Dez", saldo: 48000 },
]

const ranges = ["3M", "6M", "1A"] as const
type Range = (typeof ranges)[number]

export function FinancialGraph() {
  const [selectedRange, setSelectedRange] = useState<Range>("1A")

  // filtra os dados conforme range
  const filteredData = useMemo(() => {
    if (selectedRange === "3M") return fullData.slice(-3)
    if (selectedRange === "6M") return fullData.slice(-6)
    return fullData
  }, [selectedRange])

  // domain do Y baseado nos dados filtrados (um padding leve)
  const yDomain = useMemo(() => {
    const values = filteredData.map((d) => d.saldo)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = Math.max(1000, Math.round((max - min) * 0.08))
    return [Math.max(0, min - padding), max + padding]
  }, [filteredData])

  // Formatter para o tooltip
  const moneyFormatter = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value)

  return (
    <Card className="p-5 rounded-2xl shadow-md border border-gray-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Evolução do Saldo
        </CardTitle>

        <div className="flex items-center gap-2 text-sm">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              aria-pressed={selectedRange === range}
              className={cn(
                "px-2 py-0.5 rounded-md font-medium transition-all duration-150",
                selectedRange === range
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          {/* key no ResponsiveContainer/AreaChart força re-mount quando selectedRange muda,
              garantindo animação e atualização correta */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} key={selectedRange}>
              <defs>
                <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              {/* grid sutil */}
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E6E9EE" />

              {/* mostra todos os ticks quando poucos pontos (interval={0}) */}
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                interval={0}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(v) => `${v / 1000}k`}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={yDomain as any} /* Recharts aceita array [min, max] */
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  boxShadow: "0 6px 18px rgba(12, 14, 20, 0.06)",
                  padding: "8px 10px",
                }}
                labelStyle={{ color: "#374151", fontWeight: 600 }}
                formatter={(value: any) => moneyFormatter(Number(value))}
              />

              <Area
                // força re-mount do Area também (melhora animação ao trocar slice)
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
  )
}
