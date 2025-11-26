"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface CreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (data: {
    codigo: string;
    nome: string;
    quantidade: number;
    preco: number;
    status: "ativo" | "inativo";
  }) => void;
}

export default function CreateModal({ open, onOpenChange, onCreate }: CreateModalProps) {
  const [form, setForm] = React.useState({
    codigo: "",
    nome: "",
    quantidade: "",
    preco: "",
    status: "ativo" as "ativo" | "inativo",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.codigo || !form.nome) return alert("Preencha todos os campos obrigatórios!");
    if (onCreate) {
      onCreate({
        codigo: form.codigo,
        nome: form.nome,
        quantidade: Number(form.quantidade),
        preco: Number(form.preco),
        status: form.status,
      });
    }
    onOpenChange(false);
    setForm({ codigo: "", nome: "", quantidade: "", preco: "", status: "ativo" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              placeholder="Ex: P005"
              value={form.codigo}
              onChange={(e) => handleChange("codigo", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Ex: Headset Gamer"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                placeholder="0"
                value={form.quantidade}
                onChange={(e) => handleChange("quantidade", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="preco">Preço</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.preco}
                onChange={(e) => handleChange("preco", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
