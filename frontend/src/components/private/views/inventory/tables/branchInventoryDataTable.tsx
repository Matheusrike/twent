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
import { ArrowUpDown, MoreHorizontal, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type InventoryItem = {
  id: string;
  product: {
    sku: string;
    name: string;
    price: string;
  };
  quantity: number;
  minimum_stock: number;
};

export default function InventoryTableBranch() {
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);


  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null);
  const [editQuantity, setEditQuantity] = React.useState("");
  const [editMinimum, setEditMinimum] = React.useState("");


  React.useEffect(() => {
    async function fetchInventory() {
      try {
        setLoading(true);
        const res = await fetch("/response/api/inventory/store", {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setItems(json.data);
        } else {
          setError("Dados inválidos retornados pela API");
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar estoque da loja");
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setEditQuantity(String(item.quantity));
    setEditMinimum(String(item.minimum_stock));
    setEditDialogOpen(true);
  };

  const saveChanges = async () => {
    if (!editingItem) return;

    try {
      const res = await fetch("/response/api/inventory/store", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventory_id: editingItem.id,
          quantity: Number(editQuantity),
          minimum_stock: Number(editMinimum),
        }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === editingItem.id
              ? {
                  ...i,
                  quantity: Number(editQuantity),
                  minimum_stock: Number(editMinimum),
                }
              : i
          )
        );
        setEditDialogOpen(false);
      } else {
        alert("Erro ao salvar alterações");
      }
    } catch (err) {
      alert("Erro ao comunicar com o servidor");
    }
  };

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "product.sku",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.product.sku}</div>
      ),
    },
    {
      accessorKey: "product.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produto <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.product.name}</div>,
    },
    {
      accessorKey: "quantity",
      header: "Estoque Atual",
      cell: ({ row }) => {
        const qty = row.getValue("quantity") as number;
        const isLow = qty <= (row.original.minimum_stock || 0);
        const isZero = qty === 0;
        return (
          <div
            className={`text-center font-bold text-lg ${
              isZero ? "text-red-600" : isLow ? "text-orange-600" : "text-green-600"
            }`}
          >
            {qty}
          </div>
        );
      },
    },
    {
      accessorKey: "minimum_stock",
      header: "Estoque Mínimo",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.minimum_stock ?? 0}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.product.sku)}
              >
                Copiar SKU
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => openEditDialog(item)}
              >
                <Edit2 className="h-4 w-4" />
                Editar Estoque
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: items,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar por SKU ou nome do produto..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-center first:text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-center first:text-left"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {loading
                      ? "Carregando estoque..."
                      : error || "Nenhum item encontrado"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
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

      {/* Diálogo de Edição */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Estoque</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground">
                <strong>SKU:</strong> {editingItem.product.sku} <br />
                <strong>Produto:</strong> {editingItem.product.name}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade Atual</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  min="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="minimum">Estoque Mínimo</Label>
                <Input
                  id="minimum"
                  type="number"
                  value={editMinimum}
                  onChange={(e) => setEditMinimum(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveChanges}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}