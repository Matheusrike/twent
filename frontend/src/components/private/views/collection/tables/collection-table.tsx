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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type Collection = {
  id: string;
  name: string;
  description: string;
  launch_year: number;
  target_gender: string;
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

  const [formName, setFormName] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formYear, setFormYear] = React.useState("");
  const [formGender, setFormGender] = React.useState("MALE");
  const [formMin, setFormMin] = React.useState("");
  const [formMax, setFormMax] = React.useState("");
  const [formActive, setFormActive] = React.useState(true);

  const [editing, setEditing] = React.useState<Collection | null>(null);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormYear("");
    setFormGender("MALE");
    setFormMin("");
    setFormMax("");
    setFormActive(true);
  };

  const loadCollections = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/response/api/collection", { credentials: "include" });
    const json = await res.json();
    setCollections(json?.data?.collections ?? []);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const openEdit = (c: Collection) => {
    setEditing(c);
    setFormName(c.name);
    setFormDescription(c.description);
    setFormYear(String(c.launch_year));
    setFormGender(c.target_gender);
    setFormMin(String(c.price_range_min));
    setFormMax(String(c.price_range_max));
    setFormActive(c.is_active);
    setModalEdit(true);
  };

  const submitPost = async () => {
    const body = {
      name: formName,
      description: formDescription,
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
    }
  };

  const submitPut = async () => {
    if (!editing) return;

    const body = {
      collection_id: editing.id,
      name: formName,
      description: formDescription,
      launch_year: Number(formYear),
      target_gender: formGender,
      price_range_min: Number(formMin),
      price_range_max: Number(formMax),
      is_active: formActive,
    };

    const res = await fetch("/response/api/collection", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setModalEdit(false);
      resetForm();
      loadCollections();
    }
  };

  const columns: ColumnDef<Collection>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="w-full flex justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Nome <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "launch_year",
      header: () => <div className="text-center w-full">Ano Lançamento</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.launch_year}</div>
      ),
    },
    {
      accessorKey: "target_gender",
      header: () => <div className="text-center w-full">Gênero</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.target_gender === "MALE" ? "Masculino" : "Feminino"}
        </div>
      ),
    },
    {
      id: "qty",
      header: () => <div className="text-center w-full">Qtd Relógios</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.products?.length ?? 0}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: () => <div className="text-center w-full">Status</div>,
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge className="w-24 justify-center">
            <CheckCircle2 className="h-4 w-4" /> Ativa
          </Badge>
        ) : (
          <Badge variant="secondary" className="w-24 justify-center">
            <XCircle className="h-4 w-4" /> Inativa
          </Badge>
        ),
    },
    {
      id: "actions",
      header: () => <div className="text-center w-full">Ações</div>,
      cell: ({ row }) => {
        const col = row.original;
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openEdit(col)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: collections,
    columns,
    onSortingChange: setSorting,
    globalFilterFn: "includesString",
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar coleção"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Button
          onClick={() => {
            resetForm();
            setModalAdd(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Coleção
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-center">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
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
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  Nenhuma coleção encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={modalAdd}
        onOpenChange={(open) => {
          setModalAdd(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Coleção</DialogTitle>
          </DialogHeader>

          <Label>Nome</Label>
          <Input value={formName} onChange={(e) => setFormName(e.target.value)} />

          <Label>Descrição</Label>
          <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />

          <Label>Ano lançamento</Label>
          <Input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} />

          <Label>Gênero</Label>
          <Input value={formGender} onChange={(e) => setFormGender(e.target.value)} />

          <Label>Preço mínimo</Label>
          <Input type="number" value={formMin} onChange={(e) => setFormMin(e.target.value)} />

          <Label>Preço máximo</Label>
          <Input type="number" value={formMax} onChange={(e) => setFormMax(e.target.value)} />

          <DialogFooter>
            <Button onClick={submitPost}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalEdit}
        onOpenChange={(open) => {
          setModalEdit(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Coleção</DialogTitle>
          </DialogHeader>

          <Label>Nome</Label>
          <Input value={formName} onChange={(e) => setFormName(e.target.value)} />

          <Label>Descrição</Label>
          <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />

          <Label>Ano lançamento</Label>
          <Input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} />

          <Label>Gênero</Label>
          <Input value={formGender} onChange={(e) => setFormGender(e.target.value)} />

          <Label>Preço mínimo</Label>
          <Input type="number" value={formMin} onChange={(e) => setFormMin(e.target.value)} />

          <Label>Preço máximo</Label>
          <Input type="number" value={formMax} onChange={(e) => setFormMax(e.target.value)} />

          <div className="flex items-center gap-2">
            <Label>Ativa?</Label>
            <Switch checked={formActive} onCheckedChange={setFormActive} />
          </div>

          <DialogFooter>
            <Button onClick={submitPut}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
