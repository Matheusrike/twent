"use client";
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Plus, Minus, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type InventoryItem = {
  id: string;
  product: {
    id: string;
    sku: string;
    name: string;
  };
  quantity: number;
  minimum_stock: number;
};

export default function InventoryTable() {
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Modal de ajuste
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState<InventoryItem | null>(null);
  const [isAdding, setIsAdding] = React.useState(true); // true = + | false = -
  const [amount, setAmount] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/response/api/inventory/", { credentials: "include" });
      const json = await res.json();
      setItems(json?.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const openAdjustModal = (inventoryItem: InventoryItem, adding: boolean) => {
    setItem(inventoryItem);
    setIsAdding(adding);
    setAmount("");
    setOpen(true);
  };

  const handleAdjust = async () => {
    if (!item || !amount || Number(amount) <= 0) return;

    const qty = Number(amount);
    setSaving(true);

    try {
      const endpoint = isAdding
        ? `/response/api/inventory/add/${item.id}`
        : `/response/api/inventory/remove/${item.id}`;

      const res = await fetch(endpoint, {
        method: "PATCH", // exatamente como você usa
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });

      if (res.ok) {
        await loadData();
        setOpen(false);
      } else {
        const err = await res.json().catch(() => ({}));
        alert("Erro: " + (err.message || "Tente novamente"));
      }
    } catch (err) {
      alert("Erro de conexão");
    } finally {
      setSaving(false);
    }
  };

  const getStockLevel = (qtd: number, min: number) => {
    if (qtd === 0) return { label: "Esgotado", color: "destructive" };
    if (qtd < min) return { label: "Baixo", color: "secondary" };
    return { label: "OK", color: "default" };
  };

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "product.sku",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          SKU <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "product.name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Produto <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Estoque",
      cell: ({ row }) => (
        <div className="text-center font-bold text-lg">{row.original.quantity}</div>
      ),
    },
    {
      accessorKey: "minimum_stock",
      header: "Mínimo",
      cell: ({ row }) => <div className="text-center">{row.original.minimum_stock}</div>,
    },
    {
      id: "level",
      header: "Status",
      cell: ({ row }) => {
        const { quantity, minimum_stock } = row.original;
        const { label, color } = getStockLevel(quantity, minimum_stock);
        return (
          <div className="flex justify-center">
            <Badge variant={color as any}>{label}</Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Ajustar",
      cell: ({ row }) => {
        const i = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => openAdjustModal(i, false)}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => openAdjustModal(i, true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between">
          <Input
            placeholder="Buscar SKU ou nome..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="text-center first:text-left">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center first:text-left">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Nenhum item no estoque
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <span className="text-sm">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>

      {/* MODAL + / - */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAdding ? "Adicionar" : "Remover"} unidades
            </DialogTitle>
          </DialogHeader>

          {item && (
            <div className="space-y-4 py-4">
              <div className="text-sm space-y-1">
                <div>
                  <strong>SKU:</strong> {item.product.sku}
                </div>
                <div>
                  <strong>Produto:</strong> {item.product.name}
                </div>
                <div>
                  <strong>Estoque atual:</strong> {item.quantity}
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Quantidade a {isAdding ? "adicionar" : "remover"}
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 10"
                  autoFocus
                />
              </div>

              <div className="text-sm font-medium text-muted-foreground">
                Novo estoque:{" "}
                {isAdding
                  ? item.quantity + Number(amount || 0)
                  : item.quantity - Number(amount || 0)}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAdjust}
              disabled={saving || !amount || Number(amount) <= 0}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : isAdding ? (
                "Adicionar"
              ) : (
                "Remover"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}