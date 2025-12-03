"use client";

import * as React from "react";
import { Package, TrendingUp, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

type InventoryItem = {
  quantity: number;
  minimum_stock?: number;
  product: {
    sku: string;
    name: string;
  };
};

type Store = {
  name: string;
  inventory: InventoryItem[];
};

export default function InventoryCards() {
  const [stores, setStores] = React.useState<Store[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/response/api/inventory/all", {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        const data = json?.data ?? json;
        setStores(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar inventário:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-28 h-28 flex items-center justify-center mx-auto">
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
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    );
  };

  const StockStatus = ({ percentage }: { percentage: number }) => {
    if (percentage >= 80)
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          <Package className="h-3.5 w-3.5" />
          Estoque Alto
        </div>
      );
    if (percentage >= 50)
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          <TrendingUp className="h-3.5 w-3.5" />
          Estoque Normal
        </div>
      );
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
        <AlertCircle className="h-3.5 w-3.5" />
        Estoque Baixo
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2 pt-4 px-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {stores.map((store) => {
        const items = store.inventory ?? [];

        const current = items.reduce((acc, item) => acc + item.quantity, 0);
        const total = items.reduce(
          (acc, item) => acc + (item.minimum_stock ?? 0),
          0
        );

        const percentage = total > 0 ? (current / total) * 100 : 0;

        return (
          <Dialog key={store.name}>
            <DialogTrigger asChild>
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.08),_10px_10px_30px_4px_rgba(100,100,100,0.15)]
 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 w-full cursor-pointer">
                <CardHeader className="pb-2 pt-4 px-6 flex flex-col gap-4 items-start sm:items-center justify-between">
                  <div className="mt-2 sm:mt-0">
                    <StockStatus percentage={percentage} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {store.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="xl:p-6 flex flex-col items-center justify-center">
                  <CircularProgress percentage={percentage} />

                  <div className="flex w-full gap-4 mt-4">
                    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg flex-1 p-3 text-center">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Atual
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {current.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        unidades
                      </span>
                    </div>
                    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg flex-1 p-3 text-center">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Mínimo
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {total.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        unidades
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5 text-primary" />
                  Estoque detalhado | {store.name}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6">
                <Input
                  placeholder="Pesquisar por SKU ou nome..."
                  className="mb-4"
                  onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    const rows = document.querySelectorAll("tbody tr");
                    rows.forEach((row) => {
                      const text = row.textContent?.toLowerCase() || "";
                      (row as HTMLElement).style.display = text.includes(term)
                        ? ""
                        : "none";
                    });
                  }}
                />

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">SKU</TableHead>
                        <TableHead className="text-left">
                          Nome do Produto
                        </TableHead>
                        <TableHead className="text-right">Atual</TableHead>
                        <TableHead className="text-right">Mínimo</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground"
                          >
                            Nenhum produto em estoque
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-left font-medium">
                              {item.product.sku}
                            </TableCell>

                            <TableCell className="text-left">
                              {item.product.name}
                            </TableCell>

                            <TableCell className="text-right font-semibold">
                              {item.quantity}
                            </TableCell>

                            <TableCell className="text-right">
                              {item.minimum_stock ?? 0}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}
