"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
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

// Modais
import CreateEmployeeModal from "./form-modals/create-modal";
import EmployeeViewModal from "./form-modals/visualization-modal";

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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

export function TeamTable() {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [skip, setSkip] = React.useState(0);
  const take = 10;

  // Estados do modal de visualização
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string | null>(null);

  // Estados do modal de criação
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Busca funcionários
  const fetchEmployees = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/response/api/employee?skip=${skip}&take=${take}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao carregar funcionários");

      const json = await res.json();
      setEmployees(json.data || []);
    } catch (err: any) {
      setError("Falha ao carregar os funcionários");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [skip]);

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Atualiza lista após criar funcionário
  const handleEmployeeCreated = () => {
    setSkip(0);
    fetchEmployees();
  };

  // Colunas da tabela (definidas dentro do componente para ter acesso aos states)
  const columns = React.useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        id: "name",
        header: () => <div className="text-center font-medium">Nome</div>,
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.first_name} {row.original.last_name}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: () => <div className="text-center font-medium">E-mail</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm text-muted-foreground">
            {row.original.email}
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
        cell: ({ row }) => <div className="text-center">{row.original.store.name}</div>,
      },
      {
        accessorKey: "is_active",
        header: () => <div className="text-center font-medium">Status</div>,
        cell: ({ row }) => {
          const active = row.original.is_active;
          return (
            <div className="flex justify-center">
              <Badge variant={active ? "default" : "secondary"} className="w-24 justify-center">
                {active ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    Ativo
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3.5 w-3.5 text-red-500" />
                    Inativo
                  </>
                )}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center font-medium">Ações</div>,
        cell: ({ row }) => {
          const employee = row.original;

          return (
            <div className="flex justify-center ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedEmployeeId(employee.id);
                      setIsViewModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [] 
  );

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      {/* Cabeçalho com busca e botão novo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-5">
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((col) => col.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id === "name" ? "Nome" : column.id === "email" ? "E-mail" : column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  Carregando funcionários...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  Nenhum funcionário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSkip((p) => Math.max(p - take, 0))}
          disabled={skip === 0}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSkip((p) => p + take)}
          disabled={employees.length < take}
        >
          Próximo
        </Button>
      </div>

      {/* Modais */}
      <CreateEmployeeModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreated={handleEmployeeCreated}
      />

      {selectedEmployeeId && (
        <EmployeeViewModal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          employeeId={selectedEmployeeId}
        />
      )}
    </div>
  );
}