"use client";

import * as React from "react";
import { Package, TrendingUp, AlertCircle, Container } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

const branches = [
  { name: "Itaquera", current: 200 },
  { name: "Branch 2", current: 150 },
  { name: "Branch 3", current: 250 },
  { name: "Branch 4", current: 100 },
  { name: "Branch 5", current: 180 },
];

// Total stock
const totalStock = 1000;
const totalCurrent = branches.reduce((sum, b) => sum + b.current, 0);
const sold = totalStock - totalCurrent;

export function InventoryTotal() {
  return (
    <Card className="flex flex-col h-full w-full">
      <CardContent className="flex items-center justify-between w-full">

        <div className="flex flex-col text-left">
           <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Container className="w-5 h-5 text-primary" />
            Estoque Total
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Monitoramento em tempo real
          </CardDescription>
        </div>

    
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
          <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Atual
            </span>
            <span className="text-2xl font-bold text-foreground">
              {totalCurrent.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">unidades</span>
          </div>

          <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total
            </span>
            <span className="text-2xl font-bold text-foreground">
              {totalStock.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">unidades</span>
          </div>

          <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Vendidos
            </span>
            <span className="text-2xl font-bold text-foreground">
              {sold.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">unidades</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
