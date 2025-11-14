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
import { Button } from "@/components/ui/button";
import InventoryPagination from "./graph-modal/pagination";

export default function InventoryCards() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const items = [
    { id: 1, nome: "Twent Itaquera", current: 750, total: 1000 },
    { id: 2, nome: "Filial 2", current: 450, total: 1000 },
    { id: 3, nome: "Filial 3", current: 900, total: 1000 },
    { id: 4, nome: "Filial 4", current: 600, total: 1000 },
    { id: 5, nome: "Filial 5", current: 350, total: 1000 },
    { id: 6, nome: "Filial 6", current: 820, total: 1000 },
  ];

  const produtos = [
    {
      sku: "PRD-001",
      nome: "Camiseta Preta",
      quantidade: 120,
      categoria: "Vestuário",
    },
    {
      sku: "PRD-002",
      nome: "Tênis Branco",
      quantidade: 80,
      categoria: "Calçados",
    },
    {
      sku: "PRD-003",
      nome: "Boné Azul",
      quantidade: 45,
      categoria: "Acessórios",
    },
    {
      sku: "PRD-004",
      nome: "Jaqueta Jeans",
      quantidade: 60,
      categoria: "Vestuário",
    },
    {
      sku: "PRD-005",
      nome: "Jaqueta Jeans",
      quantidade: 60,
      categoria: "Vestuário",
    },
  ];

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
        md:grid-cols-3
        xl:grid-cols-4
        gap-6
        w-full
        h-full
      "
    >
      {items.map((item) => {
        const percentage = (item.current / item.total) * 100;

        return (
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 w-full cursor-pointer">
                {/* store and status */}
                <CardHeader className="pb-2 pt-4 px-6 flex flex-col gap-4 items-start sm:items-center justify-between">
                  <div className="mt-2 sm:mt-0">
                    <StockStatus percentage={percentage} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item.nome}
                  </CardTitle>
                </CardHeader>

                <CardContent className="xl:p-6 flex flex-col items-center justify-center">
                  {/* graph */}
                  <CircularProgress percentage={percentage} />

                  {/* inventory info */}
                  <div className="flex w-full gap-4 mt-4">
                    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg flex-1 p-3 text-center">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Atual
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {item.current.toLocaleString()}
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
                        {item.total.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        unidades
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            {/* modal */}
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5 text-primary" />
                  Estoque detalhado | {item.nome}
                </DialogTitle>
              </DialogHeader>

              {/* search bar */}
              <div className="mt-4 mb-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Pesquisar código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Categoria</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos
                      .filter((produto) =>
                        produto.sku
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((produto, index) => (
                        <TableRow key={index}>
                          <TableCell>{produto.sku}</TableCell>
                          <TableCell>{produto.nome}</TableCell>
                          <TableCell>{produto.quantidade}</TableCell>
                          <TableCell>{produto.categoria}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <InventoryPagination />
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}
