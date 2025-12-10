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
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit2,
  Plus,
  Minus,
  Check,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

type Product = {
  id: string;
  sku: string;
  name: string;
};

export default function InventoryTable() {
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Modais originais
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [addQuantity, setAddQuantity] = React.useState("");
  const [addMinimum, setAddMinimum] = React.useState("");
  const [editQuantity, setEditQuantity] = React.useState("");
  const [editMinimum, setEditMinimum] = React.useState("");

  // Modal + / -
  const [adjustOpen, setAdjustOpen] = React.useState(false);
  const [adjustItem, setAdjustItem] = React.useState<InventoryItem | null>(null);
  const [isAdding, setIsAdding] = React.useState(true);
  const [adjustAmount, setAdjustAmount] = React.useState("");
  const [adjusting, setAdjusting] = React.useState(false);

  // ===============================================
  // CARREGAR DADOS
  // ===============================================
  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [storeRes, productsRes] = await Promise.all([
        fetch("/response/api/inventory/", { credentials: "include" }),
        fetch("/response/api/product/public", { credentials: "include" }),
      ]);

      const storeJson = await storeRes.json();
      const productsJson = await productsRes.json();

      setItems(storeJson?.data ?? []);
      setAllProducts(productsJson?.data?.products ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const availableProducts = React.useMemo(() => {
    const addedSkus = new Set(items.map((i) => i.product.sku));
    return allProducts.filter((p) => !addedSkus.has(p.sku));
  }, [allProducts, items]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // ===============================================
  // ADICIONAR PRODUTO
  // ===============================================
  const handleAddProduct = async () => {
    if (!selectedProduct || !addQuantity) return;

    try {
      const res = await fetch("/response/api/inventory", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct.sku,
          quantity: Number(addQuantity),
          minimum_stock: Number(addMinimum) || 0,
        }),
      });

      if (res.ok) {
        loadData();
        setAddModalOpen(false);
        setSelectedProduct(null);
        setAddQuantity("");
        setAddMinimum("");
      } else {
        alert("Erro ao adicionar produto");
      }
    } catch (err) {
      alert("Erro ao adicionar produto");
    }
  };

  // ===============================================
  // EDITAR ESTOQUE TOTAL
  // ===============================================
  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setEditQuantity(String(item.quantity));
    setEditMinimum(String(item.minimum_stock ? String(item.minimum_stock) : ""))
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    if (!editingItem) return;

    try {
      const res = await fetch("/response/api/inventory", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventory_id: editingItem.id,
          quantity: Number(editQuantity),
          minimum_stock: Number(editMinimum || 0),
        }),
      });

      if (res.ok) {
        loadData();
        setEditModalOpen(false);
        setEditingItem(null);
        setEditQuantity("");
        setEditMinimum("");
      } else {
        alert("Erro ao salvar alterações");
      }
    } catch (err) {
      alert("Erro ao salvar");
    }
  };

  // ===============================================
  // + ADICIONAR / - REMOVER UNIDADES
  // ===============================================
  const openAdjustModal = (item: InventoryItem, adding: boolean) => {
    setAdjustItem(item);
    setIsAdding(adding);
    setAdjustAmount("");
    setAdjustOpen(true);
  };

  const handleAdjust = async () => {
    if (!adjustItem || !adjustAmount || Number(adjustAmount) <= 0) return;

    setAdjusting(true);
    const qty = Number(adjustAmount);

    const endpoint = isAdding
      ? `/response/api/inventory/add/${adjustItem.id}`
      : `/response/api/inventory/remove/${adjustItem.id}`;

    fetch(endpoint, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    })
      .then((res) => {
        if (res.ok) {
          loadData();
          setAdjustOpen(false);
          setAdjustAmount("");
        } else {
          alert("Erro ao ajustar estoque");
        }
      })
      .catch(() => alert("Erro de conexão"))
      .finally(() => setAdjusting(false));
  };

  // ===============================================
  // NÍVEL DE ESTOQUE
  // ===============================================
  const getStockLevel = (quantity: number, minimum: number) => {
    if (quantity === 0) return { label: "Esgotado", variant: "destructive" };
    if (quantity < minimum) return { label: "Baixo", variant: "secondary" };
    return { label: "OK", variant: "default" };
  };

  // ===============================================
  // COLUNAS
  // ===============================================
  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "product.sku",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          SKU <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.product.sku}</div>,
    },
    {
      accessorKey: "product.name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Produto <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.product.name}</div>,
    },
    {
      accessorKey: "quantity",
      header: "Estoque Atual",
      cell: ({ row }) => (
        <div className="text-center font-bold text-lg">{row.original.quantity}</div>
      ),
    },
    {
      accessorKey: "minimum_stock",
      header: "Mínimo",
      cell: ({ row }) => <div className="text-center font-medium">{row.original.minimum_stock}</div>,
    },
    {
      id: "stockLevel",
      header: "Nível",
      cell: ({ row }) => {
        const { label, variant } = getStockLevel(row.original.quantity, row.original.minimum_stock);
        return (
          <div className="flex justify-center">
            <Badge variant={variant as any} className="w-20 justify-center">
              {label}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => openAdjustModal(item, false)}
              title="Remover unidades"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              className="h-8 w-8"
              onClick={() => openAdjustModal(item, true)}
              title="Adicionar unidades"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.product.sku)}>
                  Copiar SKU
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openEditModal(item)}>
                  <Edit2 className="h-4 w-4 mr-2" /> Editar estoque total
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 15 } },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Buscar por SKU ou nome..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />

          <Button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Adicionar Produto
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center first:text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    Carregando...
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
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    Nenhum produto no estoque
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
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

      {/* Modal Adicionar Produto */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Produto ao Estoque</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Produto</Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between font-normal"
                  >
                    {selectedProduct
                      ? `${selectedProduct.sku} - ${selectedProduct.name}`
                      : "Selecione um produto..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar produto..." />
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {availableProducts.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => {
                            setSelectedProduct(product);
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="font-medium">{product.sku}</span> - {product.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantidade Inicial</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="25"
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Estoque Mínimo</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="5"
                  value={addMinimum}
                  onChange={(e) => setAddMinimum(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddProduct}
              disabled={!selectedProduct || !addQuantity}
            >
              Adicionar ao Estoque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Estoque Total */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Estoque</DialogTitle>
          </DialogHeader>

          {editingItem && (
            <>
              <div className="py-4 space-y-2 text-sm text-muted-foreground">
                <div><strong>SKU:</strong> {editingItem.product.sku}</div>
                <div><strong>Produto:</strong> {editingItem.product.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantidade Atual</Label>
                  <Input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estoque Mínimo</Label>
                  <Input
                    type="number"
                    value={editMinimum}
                    onChange={(e) => setEditMinimum(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEdit}>Salvar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal + Adicionar / - Remover unidades */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isAdding ? "Adicionar" : "Remover"} unidades
            </DialogTitle>
          </DialogHeader>

          {adjustItem && (
            <div className="space-y-5 py-4">
              <div className="text-sm space-y-1 text-muted-foreground">
                <div><strong>SKU:</strong> {adjustItem.product.sku}</div>
                <div><strong>Produto:</strong> {adjustItem.product.name}</div>
                <div><strong>Estoque atual:</strong> {adjustItem.quantity}</div>
              </div>

              <div className="space-y-2">
                <Label>Quantidade a {isAdding ? "adicionar" : "remover"}</Label>
                <Input
                  type="number"
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="Ex: 10"
                  autoFocus
                />
              </div>

              <div className="text-sm font-medium">
                Novo estoque:{" "}
                <strong>
                  {isAdding
                    ? adjustItem.quantity + Number(adjustAmount || 0)
                    : adjustItem.quantity - Number(adjustAmount || 0)}
                </strong>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAdjust}
              disabled={adjusting || !adjustAmount || Number(adjustAmount) <= 0}
            >
              {adjusting ? (
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