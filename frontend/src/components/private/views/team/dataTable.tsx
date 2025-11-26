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

export type Branch = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  street: string;
  is_active: boolean;
  employee: {
    position: string;
    salary: number;
    is_active: boolean;
  },
  user_roles: [
    {
        role: {
            name: string
        }
    }
  ],
  store: {
    code: string;
    name: string;
  }
};

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left"
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "nome",
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
    cell: ({ row }) => <div className="font-medium">{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "cargo",
    header: "Cargo",
    cell: ({ row }) => <div>{row.getValue("cargo")}</div>,
  },
  {
    accessorKey: "filial",
    header: "Filial",
    cell: ({ row }) => <div>{row.getValue("filial")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("is_active") as Branch["is_active"];
      return (
        <div className="flex justify-center">
          <Badge
            variant={status === true ? "default" : "secondary"}
            className="w-24 justify-center"
          >
            {status === true ? (
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
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> Visualizar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function TeamTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [branches, setBranches] = React.useState<Branch[]>([]);

  // PRECISA ACABAR ISSO TAVINHOOOOOOO
  React.useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await fetch("/response/api/employee", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar dados: ${response.status}`);
        }
        const { data } = await response.json();
        console.log(data);
        setBranches(data);
      } catch (err: any) {
        console.error(err);
      }
    }

    fetchBranches();
  }, []);

  const filterValue =
    (columnFilters.find((f) => f.id === "nome")?.value as string) ?? "";

  const filteredData = React.useMemo(() => {
    return branches.filter(
      (branch) =>
        branch.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
        branch.id.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue]);

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
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por código ou nome..."
          value={filterValue}
          onChange={(event) =>
            table.getColumn("nome")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown />
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
                    className={
                      header.id === "nome" ||
                      header.id === "cargo" ||
                      header.id === "filial"
                        ? "text-left"
                        : "text-center"
                    }
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
                      className={
                        cell.column.id === "nome" ||
                        cell.column.id === "cargo" ||
                        cell.column.id === "filial"
                          ? "text-left"
                          : "text-center"
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
  );
}
