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
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [errorAdd, setErrorAdd] = React.useState("");
  const [errorEdit, setErrorEdit] = React.useState("");

  const [formName, setFormName] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formYear, setFormYear] = React.useState("");
  const [formGender, setFormGender] = React.useState<"MALE" | "FEMALE">("MALE");
  const [formMin, setFormMin] = React.useState("");
  const [formMax, setFormMax] = React.useState("");

  const LIMIT = 10;
  const [pageIndex, setPageIndex] = React.useState(0);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [hasPrevPage, setHasPrevPage] = React.useState(false);
  const [firstLoadCompleted, setFirstLoadCompleted] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

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
    const controller = new AbortController();
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = controller;
    try {
      const res = await fetch(`/response/api/collection?limit=${LIMIT}&page=${pageIndex + 1}`, { credentials: "include", signal: controller.signal });
      const json = await res.json();
      const items = json?.data?.collections ?? [];
      setCollections(items);

      const meta = json?.data?.pagination ?? json?.data?.meta ?? {};
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
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Erro ao carregar coleções", err);
      }
    } finally {
      setLoading(false);
      setFirstLoadCompleted(true);
    }
  }, [pageIndex]);

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

  // Resetar para primeira página ao alterar filtro/ordenação
  React.useEffect(() => {
    setPageIndex(0);
  }, [globalFilter, sorting]);

  const openEdit = (collection: Collection) => {
    setEditing(collection);
    setModalEdit(true);
  };

  const submitPost = async () => {
    setErrorAdd("");
    if (!formName.trim()) { setErrorAdd("Nome é obrigatório"); return; }

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
      setPageIndex(0);
      loadCollections();
    } else {
      const data = await res.json().catch(() => null);
      setErrorAdd(data?.message || "Erro ao criar coleção");
    }
  };

  const submitPut = async () => {
    if (!editing) return;
    setErrorEdit("");
    if (!formName.trim()) { setErrorEdit("Nome é obrigatório"); return; }
    if (Number(formMin) > Number(formMax)) { setErrorEdit("Preço mínimo não pode ser maior que o máximo"); return; }

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
        // alinhado com o estilo dos formulários de relógio: fechar sem alertas
        setModalEdit(false);
        setEditing(null);
        resetForm();
        setPageIndex(0);
        loadCollections();
      } else {
        const data = await res.json().catch(() => null);
        setErrorEdit(data?.message || `Erro ${res.status} ao atualizar`);
      }
    } catch (err) {
      setErrorEdit("Erro de conexão");
    }
  };

  const toggleActiveStatus = async (activate: boolean) => {
    if (!editing) return;

    const endpoint = activate
      ? `/response/api/collection/${editing.id}/activate`
      : `/response/api/collection/${editing.id}/deactivate`;

    const res = await fetch(endpoint, { method: "PATCH", credentials: "include" });

    if (res.ok) {
      setPageIndex(0);
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
    getPaginationRowModel: undefined,
    initialState: { pagination: { pageSize: 10 } },
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
            {!firstLoadCompleted && loading ? (
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

      <div className="flex justify-end gap-3 mt-6">
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
      </div>

      <Dialog open={modalAdd} onOpenChange={(open) => { setModalAdd(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 gap-0">
          <DialogHeader className="px-8 pt-8 pb-6 border-b bg-gradient-to-br from-primary/5 to-primary/3">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Plus className="h-8 w-8" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight">Nova Coleção</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Cadastre uma nova coleção</p>
              </div>
            </div>
          </DialogHeader>

          <div className="px-8 py-6 space-y-8">
            {errorAdd && (
              <Alert variant="destructive">
                <AlertDescription>{errorAdd}</AlertDescription>
              </Alert>
            )}

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <MoreHorizontal className="h-4 w-4" />
                <span>Informações da Coleção</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome <span className="text-destructive">*</span></Label>
                  <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex.: Clássicos 2025" />
                </div>
                <div className="space-y-2">
                  <Label>Ano de Lançamento</Label>
                  <Input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} placeholder="2025" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Descrição</Label>
                  <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Descrição breve da coleção" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <Plus className="h-4 w-4" />
                <span>Faixa de Preço e Público</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Preço mínimo</Label>
                  <Input type="number" value={formMin} onChange={(e) => setFormMin(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Preço máximo</Label>
                  <Input type="number" value={formMax} onChange={(e) => setFormMax(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <select className="w-full rounded-md border px-3 py-2" value={formGender} onChange={(e) => setFormGender(e.target.value as "MALE" | "FEMALE")}> 
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Feminino</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          <div className="px-8 py-6 border-t bg-muted/40 backdrop-blur-sm flex justify-end gap-4">
            <Button variant="outline" className="rounded-xl px-8" onClick={() => setModalAdd(false)}>Cancelar</Button>
            <Button className="rounded-xl px-8" onClick={submitPost}>Criar Coleção</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalEdit} onOpenChange={(open) => { setModalEdit(open); if (!open) { resetForm(); setEditing(null); setErrorEdit(""); } }}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 gap-0">
          <DialogHeader className="px-8 pt-8 pb-6 border-b bg-gradient-to-br from-primary/5 to-primary/3">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Edit2 className="h-8 w-8" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight">Editar Coleção</DialogTitle>
                {editing && (
                  <p className="text-sm text-muted-foreground mt-1">ID: <span className="font-mono font-semibold">{editing.id}</span></p>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="px-8 py-6 space-y-8">
            {errorEdit && (
              <Alert variant="destructive">
                <AlertDescription>{errorEdit}</AlertDescription>
              </Alert>
            )}

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <MoreHorizontal className="h-4 w-4" />
                <span>Informações da Coleção</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome <span className="text-destructive">*</span></Label>
                  <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ano de Lançamento</Label>
                  <Input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Descrição</Label>
                  <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <Plus className="h-4 w-4" />
                <span>Faixa de Preço e Público</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Preço mínimo</Label>
                  <Input type="number" value={formMin} onChange={(e) => setFormMin(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Preço máximo</Label>
                  <Input type="number" value={formMax} onChange={(e) => setFormMax(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <select className="w-full rounded-md border px-3 py-2" value={formGender} onChange={(e) => setFormGender(e.target.value as "MALE" | "FEMALE")}> 
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Feminino</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          <div className="px-8 py-6 border-t flex justify-between items-center bg-muted/40 backdrop-blur-sm">
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