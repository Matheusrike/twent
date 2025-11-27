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

import CreateEmployeeModal from "./form-modals/create-modal";

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  employee: {
    position: string | null;
    salary: string;
    is_active: boolean;
  };
  user_roles: {
    role: {
      name: string;
    };
  }[];
  store: {
    name: string;
  };
};

const columns: ColumnDef<Employee>[] = [
  {
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    id: "name",
    header: () => (
      <div className="flex items-center justify-center">
        <Button variant="ghost" className="h-9 px-4 font-medium">
          Nome
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.first_name} {row.original.last_name}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.user_roles[0]?.role?.name ?? "—",
    id: "role",
    header: () => <div className="text-center font-medium">Função</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.user_roles[0]?.role?.name ?? "—"}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.store.name,
    id: "store",
    header: () => <div className="text-center font-medium">Loja</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.store.name}</div>
    ),
  },
  {
    accessorKey: "is_active",
    header: () => <div className="text-center font-medium">Status</div>,
    cell: ({ row }) => {
      const active = row.original.is_active;
      return (
        <div className="flex justify-center">
          <Badge
            variant={active ? "default" : "secondary"}
            className="w-24 justify-center py-1"
          >
            {active ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Ativa
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
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
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: () => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              Visualizar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export function TeamTable() {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [skip, setSkip] = React.useState(0);
  const take = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const fetchEmployees = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/response/api/employee?skip=${skip}&take=${take}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro ${response.status}: Não foi possível carregar os funcionários`
        );
      }

      const { data } = await response.json();
      setEmployees(data || []);
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [skip]);

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEmployeeCreated = () => {
    setSkip(0);
    fetchEmployees();
  };
  const globalFilter =
    (columnFilters.find((f) => f.id === "name")?.value as string) ?? "";

  const filteredData = React.useMemo(() => {
    if (!globalFilter) return employees;
    const term = globalFilter.toLowerCase();
    return employees.filter((emp) => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const id = emp.id.toLowerCase();
      return fullName.includes(term) || id.includes(term);
    });
  }, [employees, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center justify-between">
        <Input
          placeholder="Buscar por nome"
          value={globalFilter}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
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
            ) : table.getRowModel().rows?.length ? (
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
                  className="h-24 text-center"
                >
                  Nenhum funcionário encontrado.
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
          disabled={employees.length < take}
        >
          Próximo
        </Button>
      </div>
      <CreateEmployeeModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreated={handleEmployeeCreated}
      />
    </div>
  );
}
