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
  Pencil,
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

import { useEffect, useState } from "react";

export type Branch = {
  id: string;
  name: string;
  city: string;
  code: string;
  is_active: true | false;
};

// Dados mockados (caso a API falhe)
// const mockBranches: Branch[] = [
//   {
//     id: "1",
//     name: "Filial Itaquera",
//     city: "São Paulo",
//     code: "12.345.678/0001-00",
//     status: "ativa",
//   },
//   {
//     id: "2",
//     name: "Filial Mooca",
//     city: "São Paulo",
//     code: "98.765.432/0001-00",
//     status: "inativa",
//   },
//   {
//     id: "3",
//     name: "Filial Santos",
//     city: "Santos",
//     code: "11.222.333/0001-44",
//     status: "ativa",
//   },
//   {
//     id: "4",
//     name: "Filial Guarulhos",
//     city: "Guarulhos",
//     code: "77.888.999/0001-22",
//     status: "ativa",
//   },
// ];

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
    accessorKey: "city",
    header: "Cidade",
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    accessorKey: "code",
    header: "CNPJ",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("is_active") as Branch["is_active"];
      console.log(status)
      return (
        <div className="flex justify-center">
          <Badge
            variant={status === true ? "default" : "secondary"}
            className="w-24 justify-center"
          >
            {status === true? (
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
              className="flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(filial.code)}
            >
              <Pencil className="h-4 w-4" /> Copiar CNPJ
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> Visualizar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function BranchesTable() {
  const [branches, setBranches] = useState<Branch[] >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    async function fetchBranches() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/response/api/store", {
          method: "GET",
          credentials: "include",
        });
        
        console.log("Status da API:", response.status)

        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`);
        }

        const {data} = await response.json();
        console.log(data);
        setBranches(data);
      }  catch (error: any) {
        console.error("Erro ao buscar filiais:", error);
        setError(error.message);
        // setBranches(mockBranches);
      }
      
       finally {
        setLoading(false);
      }
    }

    fetchBranches();
    
  }, []);
  

  const filterValue =
    (columnFilters.find((f) => f.id === "name")?.value as string) ?? "";

  const filteredData = React.useMemo(() => {
    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        branch.id.toLowerCase().includes(filterValue.toLowerCase()) ||
        branch.code.toLowerCase().includes(filterValue.toLowerCase())
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
          placeholder="Buscar por nome..."
          value={filterValue}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
                      header.id === "name" ||
                      header.id === "city" ||
                      header.id === "code"
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
                        cell.column.id === "city" ||
                        cell.column.id === "code"
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