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

// Formato esperado pelo EditProductModal (preços numéricos)
type EditProductPayload = {
  sku: string;
  name: string;
  description: string | null;
  price: number;
  cost_price: number | null;
  currency: string;
  collection_id: string;
  limited_edition: boolean;
  is_active: boolean;
  specifications: {
    case_material: string | null;
    case_diameter: number | null;
    movement_type: string | null;
    total_weight: number | null;
    glass: string | null;
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

  const LIMIT = 10;
  const [pageIndex, setPageIndex] = React.useState(0);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [hasPrevPage, setHasPrevPage] = React.useState(false);
  const [firstLoadCompleted, setFirstLoadCompleted] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  // Modais
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [productToEdit, setProductToEdit] =
    React.useState<EditProductPayload | null>(null);
  const [isUploadImageOpen, setIsUploadImageOpen] = React.useState(false);
  const [selectedProductSku, setSelectedProductSku] = React.useState<
    string | null
  >(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const controller = new AbortController();
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = controller;
    try {
      const [productRes, collectionRes] = await Promise.all([
        fetch(`/response/api/product?limit=${LIMIT}&page=${pageIndex + 1}`, { credentials: "include", signal: controller.signal }),
        fetch("/response/api/collection", { credentials: "include", signal: controller.signal }),
      ]);

      const productJson = await productRes.json();
      const collectionJson = await collectionRes.json();

      const items = productJson?.data?.products ?? [];
      setProducts(items);
      setCollections(collectionJson?.data?.collections ?? []);

      const meta = productJson?.data?.pagination ?? productJson?.data?.meta ?? {};
      const currentPage = typeof meta?.page === "number" ? meta.page : pageIndex + 1;
      const totalPages = typeof meta?.totalPages === "number" ? meta.totalPages : meta?.total_pages;
      const count = typeof meta?.total === "number" ? meta.total : meta?.count;
      const limitMeta = typeof meta?.limit === "number" ? meta.limit : LIMIT;
      const hasNext = meta?.hasNext ?? meta?.has_next;
      const hasPrev = meta?.hasPrev ?? meta?.has_prev;

      if (typeof hasNext === "boolean") {
        setHasNextPage(hasNext);
      } else if (typeof totalPages === "number" && typeof currentPage === "number") {
        setHasNextPage(currentPage < totalPages);
      } else if (typeof count === "number" && typeof limitMeta === "number") {
        setHasNextPage(currentPage * limitMeta < count);
      } else {
        setHasNextPage(Array.isArray(items) ? items.length === LIMIT : false);
      }

      if (typeof hasPrev === "boolean") {
        setHasPrevPage(hasPrev);
      } else if (typeof currentPage === "number") {
        setHasPrevPage(currentPage > 1);
      } else {
        setHasPrevPage(pageIndex > 0);
      }

      setFirstLoadCompleted(true);
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Erro ao carregar dados:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [pageIndex]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Reiniciar para a primeira página quando filtro/ordenacao mudarem
  React.useEffect(() => {
    setPageIndex(0);
  }, [globalFilter, sorting]);

  // Após qualquer operação (criar/editar/ativar-desativar), limpa o filtro pra não sumir produto
  const handleSuccess = () => {
    setGlobalFilter("");
    loadData();
  };

  const handleEdit = (product: Product) => {
    // Converter o produto do formato local (preço em string) para o formato do modal (número)
    const convertedProduct: EditProductPayload = {
      sku: product.sku,
      name: product.name,
      description: product.description || null,
      price: parseFloat(product.price) || 0,
      cost_price: product.cost_price ? parseFloat(product.cost_price) : null,
      currency: product.currency,
      collection_id: product.collection_id,
      limited_edition: product.limited_edition,
      is_active: product.is_active,
      specifications: {
        case_material: product.specifications.case_material ?? null,
        case_diameter:
          typeof product.specifications.case_diameter === "number"
            ? product.specifications.case_diameter
            : null,
        movement_type: product.specifications.movement_type ?? null,
        total_weight:
          typeof product.specifications.total_weight === "number"
            ? product.specifications.total_weight
            : null,
        glass: product.specifications.glass ?? null,
      },
    };
    setProductToEdit(convertedProduct);
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
            {!firstLoadCompleted && loading ? (
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

      <div className="flex justify-end items-center gap-3 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
          disabled={!hasPrevPage}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => hasNextPage && setPageIndex((p) => p + 1)}
          disabled={loading || !hasNextPage}
        >
          Próximo
        </Button>
        {/* Indicador removido */}
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
