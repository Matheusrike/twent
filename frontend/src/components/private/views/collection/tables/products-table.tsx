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
} from "lucide-react";

import { useState } from "react";

import CreateProductModal from "../forms/create-product-modal";
import UploadImagesModal from "../forms/upload-image-form";

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

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [productToEdit, setProductToEdit] = React.useState<Product | null>(
    null
  );

  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const [selectedProductSku, setSelectedProductSku] = useState<string | null>(
    null
  );

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

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsEditOpen(true);
  };

  const handleCreate = () => {
    setProductToEdit(null);
    setIsCreateOpen(true);
  };

  const handleSuccess = () => {
    loadData();
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
      cell: ({ row }) => (
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
              onClick={() => handleUploadImage(row.original.sku)}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Imagens
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Buscar produto..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={handleCreate}>
          <Plus />
          Novo Relógio
        </Button>
      </div>

      <div className="rounded-md border mt-3">
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
                  className="text-center h-32"
                >
                  Carregando...
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

      <div className="flex justify-end gap-3 mt-4">
        <Button
          size="sm"
          variant="outline"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Próximo
        </Button>
      </div>

      <CreateProductModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleSuccess}
      />

      <UploadImagesModal
        open={isUploadImageOpen}
        sku={selectedProductSku}
        onOpenChange={setIsUploadImageOpen}
      />
    </>
  );
}
