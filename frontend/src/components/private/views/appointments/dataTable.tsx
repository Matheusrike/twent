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
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { useEffect, useState } from "react";

export type Appointment = {
  id: string;
  store_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  notes: string | null;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  created_at: string;
};

export function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchAppointments = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/response/api/appointment`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar agendamentos");
      console.error("Erro ao buscar agendamentos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleConfirm = async (id: string) => {
    try {
      const response = await fetch(`/response/api/appointment/${id}/confirm`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao confirmar agendamento");
      }

      // Recarregar a lista
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || "Erro ao confirmar agendamento");
      console.error("Erro ao confirmar agendamento:", err);
    }
  };

  const openCancelDialog = (id: string) => {
    setAppointmentToCancel(id);
    setCancelDialogOpen(true);
  };

  const handleCancel = async () => {
    if (!appointmentToCancel) return;

    try {
      const response = await fetch(`/response/api/appointment/${appointmentToCancel}/cancel`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao cancelar agendamento");
      }

      // Fechar dialog e recarregar a lista
      setCancelDialogOpen(false);
      setAppointmentToCancel(null);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || "Erro ao cancelar agendamento");
      console.error("Erro ao cancelar agendamento:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      SCHEDULED: "outline",
      CONFIRMED: "default",
      COMPLETED: "secondary",
      CANCELLED: "destructive",
    };

    const labels: Record<string, string> = {
      SCHEDULED: "Agendado",
      CONFIRMED: "Confirmado",
      COMPLETED: "Concluído",
      CANCELLED: "Cancelado",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "customer_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Cliente
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("customer_name")}</div>
      ),
    },
    {
      accessorKey: "customer_email",
      header: "E-mail",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("customer_email")}
        </div>
      ),
    },
    {
      accessorKey: "customer_phone",
      header: "Telefone",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("customer_phone")}</div>
      ),
    },
    {
      accessorKey: "appointment_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Data e Hora
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(row.getValue("appointment_date"))}</span>
        </div>
      ),
    },
    {
      accessorKey: "notes",
      header: "Observações",
      cell: ({ row }) => {
        const notes = row.getValue("notes") as string | null;
        return (
          <div className="max-w-[200px] truncate text-sm text-muted-foreground">
            {notes || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const appointment = row.original;
        const isScheduled = appointment.status === "SCHEDULED";
        const isConfirmed = appointment.status === "CONFIRMED";
        const isCancelled = appointment.status === "CANCELLED";
        const isCompleted = appointment.status === "COMPLETED";

        return (
          <div className="flex items-center gap-2">
            {isScheduled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConfirm(appointment.id)}
                className="h-8 gap-1"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Confirmar
              </Button>
            )}
            {(isScheduled || isConfirmed) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCancelDialog(appointment.id)}
                className="h-8 gap-1"
              >
                <XCircle className="h-4 w-4 text-red-600" />
                Cancelar
              </Button>
            )}
            {(isCancelled || isCompleted) && (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: appointments,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Buscar por cliente, e-mail ou telefone..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  Carregando agendamentos...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  Nenhum agendamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} agendamento(s) encontrado(s)
        </div>
        <div className="space-x-2">
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
            Próxima
          </Button>
        </div>
      </div>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
              O cliente receberá um email informando sobre o cancelamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAppointmentToCancel(null)}>
              Não, manter agendamento
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, cancelar agendamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

