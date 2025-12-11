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
  SortingState,
} from "@tanstack/react-table";

import {
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  Power,
  PowerOff,
  Trash2,
  ArrowUpDown,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

  // Estados do alert de desativação
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = React.useState(false);
  const [employeeToToggle, setEmployeeToToggle] = React.useState<{ id: string; isActive: boolean; name: string } | null>(null);
  const [toggleLoading, setToggleLoading] = React.useState(false);

  // Estados do alert de deleção
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Estado do filtro de status
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");

  // Estado de ordenação
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Estados para verificação de admin
  const [currentUser, setCurrentUser] = React.useState<{ id: string; role: string } | null>(null);
  const [adminCount, setAdminCount] = React.useState(0);

  // Busca informações do usuário logado
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/response/api/user/me", {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          const userData = json?.data ?? json;
          setCurrentUser({
            id: userData.id,
            role: userData.user_roles?.[0]?.role?.name ?? "",
          });
        }
      } catch (err) {
        console.error("Erro ao buscar usuário atual:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Busca funcionários
  const fetchEmployees = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/response/api/employee/all?skip=${skip}&take=${take}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao carregar funcionários");

      const json = await res.json();
      const employeesData = json.data || [];
      setEmployees(employeesData);

      // Busca todos os funcionários para contar admins (não apenas os da página atual)
      try {
        const allRes = await fetch(`/response/api/employee/all?skip=0&take=1000`, {
          credentials: "include",
        });
        if (allRes.ok) {
          const allJson = await allRes.json();
          const allEmployees = allJson.data || [];
          const admins = allEmployees.filter(
            (emp: Employee) => emp.user_roles?.[0]?.role?.name === "ADMIN"
          );
          setAdminCount(admins.length);
        }
      } catch (err) {
        // Se falhar, conta apenas os da página atual como fallback
        const admins = employeesData.filter(
          (emp: Employee) => emp.user_roles?.[0]?.role?.name === "ADMIN"
        );
        setAdminCount(admins.length);
      }
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
    // Dispara evento para atualizar o header
    window.dispatchEvent(new CustomEvent('team:refresh'));
  };

  // Função para abrir dialog de desativação
  const handleOpenToggleDialog = (employee: Employee) => {
    setEmployeeToToggle({
      id: employee.id,
      isActive: employee.is_active,
      name: `${employee.first_name} ${employee.last_name}`,
    });
    setIsDeactivateDialogOpen(true);
  };

  // Função para ativar/desativar funcionário
  const handleToggleEmployee = async () => {
    if (!employeeToToggle) return;

    setToggleLoading(true);
    try {
      const action = employeeToToggle.isActive ? "deactivate" : "activate";
      const res = await fetch(`/response/api/user/${action}/${employeeToToggle.id}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao alterar status do funcionário");

      setIsDeactivateDialogOpen(false);
      setEmployeeToToggle(null);
      fetchEmployees();
      // Dispara evento para atualizar o header
      window.dispatchEvent(new CustomEvent('team:refresh'));
    } catch (err: any) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar status do funcionário. Tente novamente.");
    } finally {
      setToggleLoading(false);
    }
  };

  // Função para abrir dialog de deleção
  const handleOpenDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete({
      id: employee.id,
      name: `${employee.first_name} ${employee.last_name}`,
    });
    setIsDeleteDialogOpen(true);
  };

  // Função para deletar funcionário
  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/response/api/user/${employeeToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao deletar funcionário");
      }

      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
      // Dispara evento para atualizar o header
      window.dispatchEvent(new CustomEvent('team:refresh'));
    } catch (err: any) {
      console.error("Erro ao deletar funcionário:", err);
      alert(err.message || "Erro ao deletar funcionário. Tente novamente.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Função para verificar se pode deletar/desativar
  const canModifyEmployee = React.useCallback((employee: Employee) => {
    const isAdmin = employee.user_roles?.[0]?.role?.name === "ADMIN";
    if (!isAdmin) return true;
    
    // Se for admin, só pode modificar se houver outros admins
    // Verifica se há pelo menos 2 admins (incluindo este)
    return adminCount > 1;
  }, [adminCount]);

  // Colunas da tabela (definidas dentro do componente para ter acesso aos states)
  const columns = React.useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        id: "name",
        header: ({ column }) => (
          <div className="text-center font-medium">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 -ml-3"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Nome
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.first_name} {row.original.last_name}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <div className="text-center font-medium">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 -ml-3"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              E-mail
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center text-sm text-muted-foreground">
            {row.original.email}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorFn: (row) => row.user_roles[0]?.role?.name ?? "—",
        id: "role",
        header: ({ column }) => (
          <div className="text-center font-medium">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 -ml-3"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Função
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const roleName = row.original.user_roles[0]?.role?.name ?? "—";
          const roleTranslations: Record<string, string> = {
            "EMPLOYEE_HQ": "Funcionário Matriz",
            "EMPLOYEE_BRANCH": "Funcionário Filial",
            "MANAGER_BRANCH": "Gerente de Filial",
            "ADMIN": "Administrador",
          };
          return (
            <div className="text-center">
              {roleTranslations[roleName] || roleName}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorFn: (row) => row.store.name,
        id: "store",
        header: ({ column }) => (
          <div className="text-center font-medium">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 -ml-3"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Loja
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.original.store.name}</div>,
        enableSorting: true,
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <div className="text-center font-medium">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 -ml-3"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
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
        enableSorting: true,
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => handleOpenToggleDialog(employee)}
                    disabled={!canModifyEmployee(employee)}
                    className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {employee.is_active ? (
                      <>
                        <PowerOff className="mr-2 h-4 w-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Power className="mr-2 h-4 w-4" />
                        Reativar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => handleOpenDeleteDialog(employee)}
                    disabled={!canModifyEmployee(employee)}
                    className="cursor-pointer text-destructive focus:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [handleOpenToggleDialog, handleOpenDeleteDialog, canModifyEmployee]
  );

  // Filtrar funcionários por status
  const filteredEmployees = React.useMemo(() => {
    if (statusFilter === "all") return employees;
    return employees.filter((emp) => 
      statusFilter === "active" ? emp.is_active : !emp.is_active
    );
  }, [employees, statusFilter]);

  const table = useReactTable({
    data: filteredEmployees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  // Atualiza os indicadores do header com os dados filtrados da tabela
  React.useEffect(() => {
    const activeCount = filteredEmployees.filter((e) => e.is_active).length;
    const inactiveCount = filteredEmployees.filter((e) => !e.is_active).length;
    
    window.dispatchEvent(new CustomEvent('team:update-indicators', {
      detail: { activeCount, inactiveCount }
    }));
  }, [filteredEmployees]);

  return (
    <div className="w-full space-y-4">
      {/* Cabeçalho com busca e botão novo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-5">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-md w-full"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

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
          onSuccess={handleEmployeeCreated}
          employeeId={selectedEmployeeId}
        />
      )}

      {/* Alert Dialog para desativação */}
      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {employeeToToggle?.isActive ? "Desativar Funcionário" : "Reativar Funcionário"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {employeeToToggle?.isActive ? (
                <>
                  Você está prestes a desativar o funcionário <strong>{employeeToToggle.name}</strong>.
                  <br /><br />
                  <strong>Atenção! Esta ação pode ter os seguintes impactos:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>O funcionário perderá acesso ao sistema</li>
                    <li>Não poderá realizar vendas ou operações</li>
                    <li>Histórico de atividades será preservado</li>
                    <li>Dados do funcionário serão mantidos no sistema</li>
                  </ul>
                  <br />
                  Deseja continuar?
                </>
              ) : (
                <>
                  Você está prestes a reativar o funcionário <strong>{employeeToToggle?.name}</strong>.
                  <br /><br />
                  O funcionário terá acesso ao sistema novamente e poderá realizar operações normalmente.
                  <br /><br />
                  Deseja continuar?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={toggleLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleEmployee}
              disabled={toggleLoading}
              className={employeeToToggle?.isActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {toggleLoading
                ? "Processando..."
                : employeeToToggle?.isActive
                ? "Desativar"
                : "Reativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog para deleção */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Deletar Funcionário Permanentemente
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div>
                Você está prestes a <strong className="text-destructive">deletar permanentemente</strong> o funcionário{" "}
                <strong>{employeeToDelete?.name}</strong>.
              </div>
              <div>
                <strong className="text-destructive">⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!</strong>
              </div>
              <div>
                <strong>Os seguintes dados serão permanentemente removidos:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Dados pessoais do funcionário</li>
                  <li>Informações profissionais</li>
                  <li>Histórico de relacionamento com a empresa</li>
                  <li>Acesso ao sistema</li>
                </ul>
              </div>
              <div className="pt-2 border-t">
                <strong>Esta ação não pode ser desfeita. Tem certeza que deseja continuar?</strong>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deletando..." : "Sim, Deletar Permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}