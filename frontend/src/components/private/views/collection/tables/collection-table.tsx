"use client";
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  MoreHorizontal,
  Edit2,
  Plus,
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
  DialogDescription,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Collection = {
  id: string;
  name: string;
  description: string;
  launch_year: number;
  target_gender: "MALE" | "FEMALE";
  price_range_min: number;
  price_range_max: number;
  is_active: boolean;
  products: { sku: string; name: string }[];
};

export default function CollectionsTable() {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [modalAdd, setModalAdd] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [editing, setEditing] = React.useState<Collection | null>(null);

  const [formName, setFormName] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formYear, setFormYear] = React.useState("");
  const [formGender, setFormGender] = React.useState<"MALE" | "FEMALE">("MALE");
  const [formMin, setFormMin] = React.useState("");
  const [formMax, setFormMax] = React.useState("");

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormYear("");
    setFormGender("MALE");
    setFormMin("");
    setFormMax("");
  };

  const loadCollections = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/response/api/collection", { credentials: "include" });
      const json = await res.json();
      setCollections(json?.data?.collections ?? []);
    } catch (err) {
      console.error("Erro ao carregar coleções", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  React.useEffect(() => {
    if (editing) {
      setFormName(editing.name);
      setFormDescription(editing.description || "");
      setFormYear(String(editing.launch_year));
      setFormGender(editing.target_gender);
      setFormMin(String(editing.price_range_min));
      setFormMax(String(editing.price_range_max));
    }
  }, [editing]);

  const openEdit = (collection: Collection) => {
    setEditing(collection);
    setModalEdit(true);
  };

  const submitPost = async () => {
    if (!formName.trim()) return alert("Nome é obrigatório");

    const body = {
      name: formName.trim(),
      description: formDescription.trim(),
      launch_year: Number(formYear),
      target_gender: formGender,
      price_range_min: Number(formMin),
      price_range_max: Number(formMax),
      is_active: true,
    };

    const res = await fetch("/response/api/collection", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setModalAdd(false);
      resetForm();
      loadCollections();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.message || "Erro ao criar coleção");
    }
  };

  const submitPut = async () => {
    if (!editing) return;
    if (!formName.trim()) return alert("Nome é obrigatório");
    if (Number(formMin) > Number(formMax)) return alert("Preço mínimo não pode ser maior que o máximo");

    const body = {
      name: formName.trim(),
      description: formDescription.trim(),
      launch_year: Number(formYear),
      target_gender: formGender,
      price_range_min: Number(formMin),
      price_range_max: Number(formMax),
    };

    try {
      const res = await fetch(`/response/api/collection/${editing.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Coleção atualizada com sucesso!");
        setModalEdit(false);
        setEditing(null);
        resetForm();
        loadCollections();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message || `Erro ${res.status} ao atualizar`);
      }
    } catch (err) {
      alert("Erro de conexão");
    }
  };

  const toggleActiveStatus = async (activate: boolean) => {
    if (!editing) return;

    const endpoint = activate
      ? `/response/api/collection/${editing.id}/activate`
      : `/response/api/collection/${editing.id}/deactivate`;

    const res = await fetch(endpoint, { method: "PATCH", credentials: "include" });

    if (res.ok) {
      loadCollections();
      setModalEdit(false);
      setEditing(null);
      resetForm();
    } else {
      alert("Erro ao alterar status");
    }
  };

  const columns: ColumnDef<Collection>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()} className="w-full justify-center">
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    {
      accessorKey: "launch_year",
      header: () => <div className="text-center">Ano</div>,
      cell: ({ row }) => <div className="text-center">{row.original.launch_year}</div>,
    },
    {
      accessorKey: "target_gender",
      header: () => <div className="text-center">Gênero</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.target_gender === "MALE" ? "Masculino" : "Feminino"}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: () => <div className="text-center">Status</div>,
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
      cell: ({ row }) => {
        const col = row.original;
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
              <DropdownMenuItem onClick={() => openEdit(col)}>
                <Edit2 className="h-4 w-4 mr-2" /> Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: collections,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Buscar coleção..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => { resetForm(); setModalAdd(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nova Coleção
        </Button>
      </div>

      <div className="border rounded-lg">
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
                <TableCell colSpan={columns.length} className="text-center h-32">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-32">
                  Nenhuma coleção encontrada
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalAdd} onOpenChange={(open) => { setModalAdd(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg rounded-2xl border shadow-xl p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Nova Coleção</DialogTitle>
            <DialogDescription>Preencha os dados para cadastrar uma nova coleção.</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div><Label>Nome</Label><Input value={formName} onChange={(e) => setFormName(e.target.value)} /></div>
            <div><Label>Descrição</Label><Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} /></div>
            <div><Label>Ano</Label><Input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} /></div>
            <div>
              <Label>Gênero</Label>
              <select className="w-full rounded-md border px-3 py-2" value={formGender} onChange={(e) => setFormGender(e.target.value as "MALE" | "FEMALE")}>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
              </select>
            </div>
            <div><Label>Preço mínimo</Label><Input type="number" value={formMin} onChange={(e) => setFormMin(e.target.value)} /></div>
            <div><Label>Preço máximo</Label><Input type="number" value={formMax} onChange={(e) => setFormMax(e.target.value)} /></div>
          </div>
          <div className="px-6 py-4 border-t bg-muted/40 backdrop-blur-sm flex justify-end gap-4">
            <Button variant="outline" className="rounded-xl px-8" onClick={() => setModalAdd(false)}>Cancelar</Button>
            <Button className="rounded-xl px-8" onClick={submitPost}>Criar Coleção</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalEdit} onOpenChange={(open) => { setModalEdit(open); if (!open) { resetForm(); setEditing(null); } }}>
        <DialogContent className="max-w-lg rounded-2xl border shadow-xl p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Editar Coleção</DialogTitle>
            <DialogDescription>Atualize os dados desta coleção.</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div><Label>Nome</Label><Input value={formName} onChange={(e) => setFormName(e.target.value)} /></div>
            <div><Label>Descrição</Label><Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} /></div>
            <div><Label>Ano</Label><Input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} /></div>
            <div>
              <Label>Gênero</Label>
              <select className="w-full rounded-md border px-3 py-2" value={formGender} onChange={(e) => setFormGender(e.target.value as "MALE" | "FEMALE")}>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
              </select>
            </div>
            <div><Label>Preço mínimo</Label><Input type="number" value={formMin} onChange={(e) => setFormMin(e.target.value)} /></div>
            <div><Label>Preço máximo</Label><Input type="number" value={formMax} onChange={(e) => setFormMax(e.target.value)} /></div>
          </div>
          <div className="px-6 py-4 border-t flex justify-between items-center bg-muted/40 backdrop-blur-sm">
            {editing?.is_active ? (
              <Button variant="destructive" className="rounded-xl px-6 flex items-center gap-2" onClick={() => toggleActiveStatus(false)}>
                <XCircle className="h-4 w-4" /> Desativar
              </Button>
            ) : (
              <Button className="rounded-xl px-6 flex items-center gap-2 bg-red-600 hover:bg-red-700" onClick={() => toggleActiveStatus(true)}>
                <CheckCircle2 className="h-4 w-4" /> Ativar
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" className="rounded-xl px-8" onClick={() => setModalEdit(false)}>Cancelar</Button>
              <Button className="rounded-xl px-8" onClick={submitPut}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}