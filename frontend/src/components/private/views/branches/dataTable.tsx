"use client";
import CreateModal from "./form-modals/create-modal";
import VisualizationModal from "./form-modals/visualization-modal";
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
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Pencil,
  Eye,
  Plus,
  ChevronDown,
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

import { useEffect, useState } from "react";

export type Branch = {
  id: string;
  name: string;
  code: string;
  zip_code: string;
  country: string;
  email: string;
  is_active: boolean;
};

export function BranchesTable() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isVisualizationModalOpen, setIsVisualizationModalOpen] =
    useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | undefined>(
    undefined
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [skip, setSkip] = React.useState(0);
  const [take, setTake] = React.useState(10);

  const fetchBranches = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/response/api/store?skip=${skip}&take=${take}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const { data } = await response.json();
      setBranches(data);
    } catch (error: any) {
      console.error("Erro ao buscar filiais:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [skip, take]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleOpenVisualizationModal = (id: string) => {
    setEditingStoreId(id);
    setIsVisualizationModalOpen(true);
  };

  const handleCloseVisualizationModal = () => {
    setIsVisualizationModalOpen(false);
    setEditingStoreId(undefined);
  };

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    handleCloseVisualizationModal();
    fetchBranches();
  };

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("code")}</div>
      ),
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },

    {
      accessorKey: "country",
      header: "País",
      cell: ({ row }) => <div>{row.getValue("country")}</div>,
    },

    {
      accessorKey: "zip_code",
      header: "CEP",
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.getValue("zip_code")}</div>
      ),
    },

    {
      accessorKey: "email",
      header: "E-mail",
      cell: ({ row }) => <div className="text-xs">{row.getValue("email")}</div>,
    },

    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("is_active") as boolean;

        return (
          <div className="flex justify-center">
            <Badge
              variant={status ? "default" : "secondary"}
              className="w-24 justify-center"
            >
              {status ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  Ativa
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Inativa
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
        const filial = row.original;
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
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(filial.email)}
              >
                <Pencil className="h-4 w-4" /> Copiar Email
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleOpenVisualizationModal(filial.id)}
              >
                <Eye className="h-4 w-4" /> Visualizar / Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filterValue =
    (columnFilters.find((f) => f.id === "name")?.value as string) ?? "";

  const filteredData = React.useMemo(() => {
    const term = filterValue.toLowerCase();

    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(term) ||
        branch.code.toLowerCase().includes(term) ||
        branch.zip_code.toLowerCase().includes(term) ||
        branch.email.toLowerCase().includes(term)
    );
  }, [filterValue, branches]);

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por nome ou código..."
          value={filterValue}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
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

        <Button
          variant="default"
          className="ml-2 flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
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
                    className={
                      header.id === "name" ||
                      header.id === "country" ||
                      header.id === "zip_code" ||
                      header.id === "email"
                        ? "text-left"
                        : "text-center"
                    }
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "name" ||
                        cell.column.id === "country" ||
                        cell.column.id === "zip_code" ||
                        cell.column.id === "email"
                          ? "text-left"
                          : "text-center"
                      }
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
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
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
          onClick={() => setSkip((prev) => Math.max(prev - take, 0))}
          disabled={skip === 0}
        >
          Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSkip((prev) => prev + take)}
        >
          Próximo
        </Button>
      </div>

      <CreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreated={handleSuccess}
      />

      <VisualizationModal
        open={isVisualizationModalOpen}
        onOpenChange={handleCloseVisualizationModal}
        onSuccess={handleSuccess}
        storeId={editingStoreId}
      />
    </div>
  );
}
