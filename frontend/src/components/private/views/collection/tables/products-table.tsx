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
  Image as ImageIcon,
  X,
} from "lucide-react";

import CreateProductModal from "../forms/create-product-modal";
import UploadImagesModal from "../forms/upload-image-form";
import EditProductModal from "../forms/edit-product";

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
import { Badge } from "@/components/ui/badge";

type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  limited_edition: boolean;
  price: string;
  cost_price: string;
  currency: string;
  is_active: boolean;
  collection_id: string;
  specifications: {
    glass: string;
    total_weight: number;
    case_diameter: number;
    case_material: string;
    movement_type: string;
  };
};

type Collection = {
  id: string;
  name: string;
};

export default function CollectionProductsTable() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Modais
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [productToEdit, setProductToEdit] = React.useState<Product | null>(
    null
  );
  const [isUploadImageOpen, setIsUploadImageOpen] = React.useState(false);
  const [selectedProductSku, setSelectedProductSku] = React.useState<
    string | null
  >(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, collectionRes] = await Promise.all([
        fetch("/response/api/product", { credentials: "include" }),
        fetch("/response/api/collection", { credentials: "include" }),
      ]);

      const productJson = await productRes.json();
      const collectionJson = await collectionRes.json();

      setProducts(productJson?.data?.products ?? []);
      setCollections(collectionJson?.data?.collections ?? []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Após qualquer operação (criar/editar/ativar-desativar), limpa o filtro pra não sumir produto
  const handleSuccess = () => {
    setGlobalFilter("");
    loadData();
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsEditOpen(true);
  };

  const handleUploadImage = (sku: string) => {
    setSelectedProductSku(sku);
    setIsUploadImageOpen(true);
  };

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
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "collection_id",
      header: "Coleção",
      cell: ({ row }) => {
        const collection = collections.find(
          (c) => c.id === row.original.collection_id
        );
        return collection?.name ?? "-";
      },
    },
    {
      accessorKey: "limited_edition",
      header: "Edição",
      cell: ({ row }) => (
        <Badge variant={row.original.limited_edition ? "default" : "secondary"}>
          {row.original.limited_edition ? "Limitada" : "Normal"}
        </Badge>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.is_active ? "default" : "secondary"}
          className="w-24 justify-center"
        >
          {row.original.is_active ? "Ativo" : "Inativo"}
        </Badge>
      ),
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
              <DropdownMenuItem onClick={() => handleUploadImage(product.sku)}>
                <ImageIcon className="mr-2 h-4 w-4" />
                Imagens
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(product)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
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
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // Filtro global inteligente – não depende do texto renderizado
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = (filterValue || "").toString().toLowerCase().trim();
      if (!search) return true;

      const product = row.original;
      const collectionName =
        collections
          .find((c) => c.id === product.collection_id)
          ?.name?.toLowerCase() || "";

      return (
        product.sku.toLowerCase().includes(search) ||
        product.name.toLowerCase().includes(search) ||
        collectionName.includes(search) ||
        (product.limited_edition ? "limitada" : "normal").includes(search) ||
        (product.is_active ? "ativo" : "inativo").includes(search)
      );
    },

    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="relative max-w-sm">
          <Input
            placeholder="Buscar por SKU, nome, coleção..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pr-10"
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Relógio
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  Carregando produtos...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>

      <CreateProductModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleSuccess}
      />

      <EditProductModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        product={productToEdit}
        onSuccess={handleSuccess}
      />

      <UploadImagesModal
        open={isUploadImageOpen}
        onOpenChange={setIsUploadImageOpen}
        sku={selectedProductSku}
      />
    </>
  );
}
