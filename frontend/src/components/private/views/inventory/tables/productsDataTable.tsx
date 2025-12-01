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
  Eye,
  Plus,
  Package,
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


type InventoryItem = {
  id: string;
  quantity: number;
  minimum_stock: number;
  product: {
    id: string;
    sku: string;
    name: string;
    price: string;
    currency: string;
    is_active: boolean;
    collection_id?: string | null;
    collection?: { id: string; name: string } | null;
  };
};

type Store = {
  name: string;
  email: string;
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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);


  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

 
  const processInventoryData = React.useCallback((stores: Store[]) => {
    const productMap = new Map<string, Product>();

    stores.forEach((store) => {
      store.inventory.forEach((item) => {
        const p = item.product;
        const current = productMap.get(p.id);

        const newTotalStock = (current?.totalStock || 0) + item.quantity;

        productMap.set(p.id, {
          id: p.id,
          sku: p.sku,
          name: p.name,
          price: Number(p.price),
          currency: p.currency || "BRL",
          is_active: p.is_active,
          collection_name: p.collection?.name ?? null,
          totalStock: newTotalStock,
        });
      });
    });


    const sortedProducts = Array.from(productMap.values()).sort((a, b) =>
      a.sku.localeCompare(b.sku)
    );

    setProducts(sortedProducts);
  }, []);


  React.useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      try {
        const res = await fetch("/response/api/inventory/all");
        if (!res.ok) throw new Error(`Erro ${res.status}`);

        const json = await res.json();
        const data: Store[] = json?.data ?? json;

        if (Array.isArray(data)) {
          processInventoryData(data);
        } else {
          setError("Formato de dados inválido");
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar inventário");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, [processInventoryData]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);

  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          SKU <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Produto <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      id: "collection",
      accessorFn: (row) => row.collection_name ?? "Sem coleção",
      header: "Coleção",
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.getValue("collection")}</div>,
    },
    {
      accessorKey: "price",
      header: "Preço",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        const currency = row.original.currency;
        return (
          <div className="text-center font-medium">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(price)}
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
          <div className={`text-center font-bold text-lg ${isCritical ? "text-red-600" : isLow ? "text-orange-600" : "text-green-600"}`}>
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
            <Badge variant={active ? "default" : "secondary"} className="w-24 justify-center">
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.sku)}>
                Copiar SKU
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar por SKU ou nome..."
            value={(table.getColumn("sku")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("sku")?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
          <Button className="ml-auto">
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center first:text-left">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell key={cell.id} className="text-center first:text-left">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    {loading ? "Carregando inventário..." : error || "Nenhum produto encontrado"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Próximo
          </Button>
        </div>
      </div>

      {/* Modal */}
      
    </>
  );
}