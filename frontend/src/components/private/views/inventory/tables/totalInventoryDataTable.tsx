"use client";

import * as React from "react";
import {
  ColumnDef,
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
  MoreHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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
} from "@/components/ui/dialog";

type InventoryItem = {
  quantity: number;
  product: {
    sku: string;
  };
};

type Store = {
  name: string;
  inventory: InventoryItem[];
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  is_active: boolean;
  collection_name: string | null;
  totalStock: number;
};

export default function InventoryTable() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [inventories, setInventories] = React.useState<Store[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [selectedStores, setSelectedStores] = React.useState<
    { name: string; quantity: number }[]
  >([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const processInventoryData = React.useCallback(
    (stores: Store[], productsApi: any) => {
      const stockMap = new Map<string, number>();

      stores.forEach((store) => {
        store.inventory.forEach((item) => {
          const sku = item.product.sku;
          const prev = stockMap.get(sku) || 0;
          stockMap.set(sku, prev + item.quantity);
        });
      });

      const productsArray = Array.isArray(productsApi)
        ? productsApi
        : [productsApi];

      const merged: Product[] = productsArray.map((p) => ({
        id: p.sku,
        sku: p.sku,
        name: p.name,
        price: Number(p.price),
        currency: p.currency || "BRL",
        is_active: p.is_active,
        collection_name: p.collection?.name ?? null,
        totalStock: stockMap.get(p.sku) || 0,
      }));

      merged.sort((a, b) => a.sku.localeCompare(b.sku));
      setProducts(merged);
    },
    []
  );

  React.useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);

        const [invRes, prodRes] = await Promise.all([
          fetch("/response/api/inventory/all", {
            method: "GET",
            credentials: "include",
          }),
          fetch("/response/api/product", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const invJson = await invRes.json();
        const prodJson = await prodRes.json();

        const stores: Store[] = invJson?.data ?? invJson;
        const productsApi = prodJson?.data?.products ?? [];

        setInventories(stores);
        processInventoryData(stores, productsApi);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [processInventoryData]);

  function openProductDialog(sku: string) {
    setSelectedProduct(sku);
    const storesWithProduct = inventories
      .map((store) => {
        const item = store.inventory.find((i) => i.product.sku === sku);
        return item ? { name: store.name, quantity: item.quantity } : null;
      })
      .filter(Boolean) as { name: string; quantity: number }[];
    setSelectedStores(storesWithProduct);
    setOpenDialog(true);
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("sku")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produto <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      id: "collection",
      accessorFn: (row) => row.collection_name ?? "Sem coleção",
      header: "Coleção",
      cell: ({ row }) => (
        <div className="text-center text-muted-foreground">
          {row.getValue("collection")}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Preço",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        const currency = row.original.currency;
        return (
          <div className="text-center font-medium">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency,
            }).format(price)}
          </div>
        );
      },
    },
    {
      accessorKey: "totalStock",
      header: "Estoque Total",
      cell: ({ row }) => {
        const stock = row.getValue("totalStock") as number;
        const isLow = stock <= 5;
        const isCritical = stock === 0;
        return (
          <div
            className={`text-center font-bold text-lg ${
              isCritical
                ? "text-red-600"
                : isLow
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {stock}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("is_active") as boolean;
        return (
          <div className="flex justify-center">
            <Badge
              variant={active ? "default" : "secondary"}
              className="w-24 justify-center"
            >
              {active ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Ativo
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="h-4 w-4" /> Inativo
                </div>
              )}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
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
                onClick={() => navigator.clipboard.writeText(product.sku)}
              >
                Copiar SKU
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openProductDialog(product.sku)}>
                Visualizar Estoque
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar por SKU ou nome..."
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
                      ? "Carregando..."
                      : error || "Nenhum produto encontrado"}
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Estoque do produto {selectedProduct}</DialogTitle>
          </DialogHeader>

          {selectedStores.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Nenhuma loja possui este produto.
            </p>
          ) : (
            <div className="space-y-4">
              {selectedStores.map((store, index) => (
                <div
                  key={index}
                  className="flex justify-between border p-3 rounded-md"
                >
                  <span className="font-medium">{store.name}</span>
                  <span className="font-bold">{store.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}