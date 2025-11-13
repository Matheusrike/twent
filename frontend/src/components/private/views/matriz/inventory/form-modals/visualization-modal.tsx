"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto?: {
    codigo: string;
    nome: string;
    quantidade: number;
    preco: number;
    status: "ativo" | "inativo";
  };
}

export default function VisualizationModal({ open, onOpenChange, produto }: ProductDialogProps) {
  if (!produto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Produto</DialogTitle>
          <DialogDescription>
            Visualize as informações completas do produto selecionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><strong>Código:</strong> {produto.codigo}</p>
          <p><strong>Nome:</strong> {produto.nome}</p>
          <p><strong>Quantidade:</strong> {produto.quantidade}</p>
          <p><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                produto.status === "ativo"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {produto.status === "ativo" ? "Ativo" : "Inativo"}
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
