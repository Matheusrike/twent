"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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

export type Product = {
  sku: string;
  name: string;
  collection_id?: string | null;
  collection_name?: string | null;
  price: number;
  is_active: boolean;
};

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  launch_year: number | null;
  is_active: boolean;
  products?: Product[];
};

export default function InventoryTable() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedCollection, setSelectedCollection] = React.useState<Collection | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"product" | "collection">("product");
  const [filterCollectionId, setFilterCollectionId] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [fetchTimestamp, setFetchTimestamp] = React.useState<number>(Date.now());

  React.useEffect(() => {
    let mounted = true;
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/response/api/product");
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const data = json?.data ?? json;
        const mapped: Product[] = (Array.isArray(data) ? data : []).map((p: any) => ({
          sku: p.sku,
          name: p.name,
          collection_id: p.collection?.id ?? p.collection_id ?? null,
          collection_name: p.collection?.name ?? null,
          price: Number(p.price ?? 0),
          is_active: Boolean(p.is_active),
        }));
        if (mounted) setProducts(mapped);
      } catch (err: any) {
        if (mounted) setError(err?.message ?? "Erro ao carregar produtos");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [fetchTimestamp]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("product");
    setModalOpen(true);
  };

  const openCollectionModal = async (collectionId: string | null) => {
    if (!collectionId) return;
    setModalMode("collection");
    setSelectedCollection(null);
    setModalOpen(true);
    try {
      const res = await fetch(`/response/api/collection/${collectionId}`);
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      const payload = json?.data ?? json;
      const coll: Collection = {
        id: payload.id,
        name: payload.name,
        description: payload.description ?? null,
        launch_year: payload.launch_year ?? null,
        is_active: Boolean(payload.is_active),
        products: Array.isArray(payload.products)
          ? payload.products.map((p: any) => ({
              sku: p.sku,
              name: p.name,
              collection_id: payload.id,
              collection_name: payload.name,
              price: Number(p.price ?? 0),
              is_active: Boolean(p.is_active),
            }))
          : [],
      };
      setSelectedCollection(coll);
    } catch {
      setSelectedCollection({
        id: collectionId,
        name: "Erro ao carregar",
        description: null,
        launch_year: null,
        is_active: false,
        products: [],
      });
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      id: "collection",
      accessorFn: (row) => row.collection_name ?? row.collection_id ?? "—",
      header: "Coleção",
      cell: ({ row }) => {
        const colName = row.getValue("collection") as string;
        return (
          <div className="flex items-center justify-center gap-2">
            <div>{colName}</div>
          
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Preço (R$)",
      cell: ({ row }) => (
        <div className="text-center">{Number(row.getValue("price")).toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <div className="flex justify-center">
            <Badge variant={isActive ? "default" : "secondary"} className="w-24 justify-center">
              {isActive ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Ativo
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  Inativo
                </div>
              )}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const produto = row.original;
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
                className="flex items-center gap-2"
                onClick={() => navigator.clipboard.writeText(produto.sku)}
              >
                Copiar SKU
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => openProductModal(produto)}
              >
                <Eye className="h-4 w-4" />
                Visualizar/Editar
              </DropdownMenuItem>
          
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filterValue = (columnFilters.find((f) => f.id === "sku")?.value as string) ?? "";

  const filteredData = React.useMemo(() => {
    const base = products.filter(
      (product) =>
        product.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        product.sku.toLowerCase().includes(filterValue.toLowerCase())
    );
    return filterCollectionId ? base.filter((p) => p.collection_id === filterCollectionId) : base;
  }, [products, filterValue, filterCollectionId]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder="Buscar por SKU ou nome..."
            value={filterValue}
            onChange={(e) => table.getColumn("sku")?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="default" className="ml-2 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Novo
          </Button>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={header.id === "name" ? "text-left" : "text-center"}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.id === "name" ? "text-left" : "text-center"}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {loading ? "Carregando..." : error ? `Erro: ${error}` : "Nenhum resultado encontrado."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
               Visualizar Produto
            </DialogTitle>
          </DialogHeader>

          {modalMode === "product" && selectedProduct && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="text-lg font-semibold">{selectedProduct.name}</div>
                <div className="text-sm text-muted-foreground">{selectedProduct.sku}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço</Label>
                  <div className="mt-1">R$ {selectedProduct.price.toFixed(2)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{selectedProduct.is_active ? "Ativo" : "Inativo"}</div>
                </div>
                <div className="col-span-2">
                  <Label>Coleção</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <div>{selectedProduct.collection_name ?? selectedProduct.collection_id ?? "—"}</div>
                    {selectedProduct.collection_id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openCollectionModal(selectedProduct.collection_id!)}
                      >
                        Ver Coleção
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-center">
            <Button onClick={() => setModalOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}