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
  Check,
  ChevronsUpDown,
  CheckCircle2,
  XCircle,
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = React.useState("");
  const [openCollectionCombo, setOpenCollectionCombo] = React.useState(false);

  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null
  );
  const [formName, setFormName] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formPrice, setFormPrice] = React.useState("");
  const [formCostPrice, setFormCostPrice] = React.useState("");
  const [formLimited, setFormLimited] = React.useState(false);
  const [formActive, setFormActive] = React.useState(true);
  const [formCaseMaterial, setFormCaseMaterial] = React.useState("");
  const [formCaseDiameter, setFormCaseDiameter] = React.useState("");
  const [formMovement, setFormMovement] = React.useState("");
  const [formWeight, setFormWeight] = React.useState("");
  const [formGlass, setFormGlass] = React.useState("");
  const [formCurrency, setFormCurrency] = React.useState("BRL");
  const [files, setFiles] = React.useState<FileList | null>(null);

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
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormDescription(p.description);
    setFormPrice(p.price);
    setFormCostPrice(p.cost_price);
    setFormLimited(p.limited_edition);
    setFormActive(p.is_active);
    setFormCurrency(p.currency);
    setSelectedCollectionId(p.collection_id);
    setFormCaseMaterial(p.specifications.case_material);
    setFormCaseDiameter(String(p.specifications.case_diameter));
    setFormMovement(p.specifications.movement_type);
    setFormWeight(String(p.specifications.total_weight));
    setFormGlass(p.specifications.glass);
    setEditModalOpen(true);
  };

  const submitUpdate = async () => {
    if (!editingProduct) return;

    const res = await fetch("/response/api/product", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: editingProduct.sku,
        name: formName,
        description: formDescription,
        price: Number(formPrice),
        currency: formCurrency,
        cost_price: Number(formCostPrice),
        collection_id: selectedCollectionId,
        limited_edition: formLimited,
        is_active: formActive,
        specifications: {
          case_material: formCaseMaterial,
          case_diameter: Number(formCaseDiameter),
          movement_type: formMovement,
          total_weight: Number(formWeight),
          glass: formGlass,
        },
      }),
    });

    if (res.ok) {
      setEditModalOpen(false);
      loadData();
    }
  };

  const submitCreate = async () => {
    const res = await fetch("/response/api/product", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formName,
        description: formDescription,
        price: Number(formPrice),
        currency: formCurrency,
        cost_price: Number(formCostPrice),
        collection_id: selectedCollectionId,
        limited_edition: formLimited,
        specifications: {
          case_material: formCaseMaterial,
          case_diameter: Number(formCaseDiameter),
          movement_type: formMovement,
          total_weight: Number(formWeight),
          glass: formGlass,
        },
      }),
    });

    if (res.ok) {
      setAddModalOpen(false);
      loadData();
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
          SKU <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.sku,
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
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "collection_id",
      header: "Coleção",
      cell: ({ row }) => {
        const id = row.original.collection_id;
        const collection = collections.find((c) => c.id === id);
        return collection?.name ?? "-";
      },
    },
    {
      accessorKey: "limited_edition",
      header: "Edição",
      cell: ({ row }) =>
        row.original.limited_edition ? (
          <Badge variant="default">Limitada</Badge>
        ) : (
          <Badge variant="secondary">Normal</Badge>
        ),
    },
   {
  accessorKey: "is_active",
  header: "Status",
  cell: ({ row }) => {
    const active = row.original.is_active;
    return (
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
              <DropdownMenuItem onClick={() => openEdit(product)}>
                <Edit2 className="mr-2 h-4 w-4" /> Editar
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
    globalFilterFn: "includesString",
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Input
          placeholder="Buscar produto"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Relógio
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
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
                  className="h-32 text-center"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-3 mt-4">
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
    </>
  );
}
