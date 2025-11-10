"use client";

import * as React from "react";
import { Package, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EstoqueCards() {
  const items = [
    { id: 1, nome: "Twent Itaquera", porcentagem: 75 },
    { id: 2, nome: "Filial 2", porcentagem: 45 },
    { id: 3, nome: "Filial 3", porcentagem: 90 },
    { id: 4, nome: "Filial 4", porcentagem: 60 },
    { id: 5, nome: "Filial 5", porcentagem: 35 },
    { id: 6, nome: "Filial 6", porcentagem: 82 },
  ];

  const stockData = {
    current: 900,
    total: 1000,
  };

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;


    return (
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="transform -rotate-90 w-28 h-28">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#de1a26"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
    );
  };

  // === Componente de status dinâmico ===
  const StockStatus = ({ percentage }: { percentage: number }) => {
    if (percentage >= 80) {
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          <Package className="h-3.5 w-3.5" />
          Estoque Alto
        </div>
      );
    } else if (percentage >= 50) {
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          <TrendingUp className="h-3.5 w-3.5" />
          Estoque Normal
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          <AlertCircle className="h-3.5 w-3.5" />
          Estoque Baixo
        </div>
      );
    }
  };

  return (
    <div
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-6 
        w-full 
        h-full
      "
    >
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Cabeçalho com nome e status */}
          <CardHeader className="pb-3 pt-4 px-6 flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {item.nome}
            </CardTitle>
            <StockStatus percentage={item.porcentagem} />
          </CardHeader>

          {/* Corpo com quantidades e gráfico */}
          <CardContent className="p-6 pt-2 flex items-center justify-between">
            {/* Quantidades */}
            <div className="flex flex-1 gap-4">
              <div className="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg flex-1 p-3 text-center">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Atual
                </span>
                <span className="text-xl font-bold text-foreground">
                  {stockData.current.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  unidades
                </span>
              </div>

              <div className="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg flex-1 p-3 text-center">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Total
                </span>
                <span className="text-xl font-bold text-foreground">
                  {stockData.total.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  unidades
                </span>
              </div>
            </div>

            {/* Gráfico circular */}
            <CircularProgress percentage={item.porcentagem} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
