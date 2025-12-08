// components/forms/edit-product-modal.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Watch,
  Package,
  DollarSign,
  Tag,
  Ruler,
  Weight,
  Gem,
  AlertCircle,
  CheckCircle2,
  ChevronsUpDown,
} from "lucide-react";

type Collection = {
  id: string;
  name: string;
};

type Product = {
  sku: string;
  name: string;
  description: string | null;
  price: number;
  cost_price: number | null;
  currency: string;
  collection_id: string;
  limited_edition: boolean;
  is_active: boolean;
  specifications: {
    case_material: string | null;
    case_diameter: number | null;
    movement_type: string | null;
    total_weight: number | null;
    glass: string | null;
  };
};

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null; 
  onSuccess?: () => void;
}

export default function EditProductModal({
  open,
  onOpenChange,
  product,
  onSuccess,
}: EditProductModalProps) {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [collectionOpen, setCollectionOpen] = React.useState(false);

  const [form, setForm] = React.useState({
    name: "",
    description: "",
    price: "",
    cost_price: "",
    currency: "BRL",
    collection_id: "",
    limited_edition: false,
    is_active: true,
    case_material: "",
    case_diameter: "",
    movement_type: "",
    total_weight: "",
    glass: "",
  });

  // Carrega coleções e preenche formulário quando abre ou muda o produto
  React.useEffect(() => {
    if (open) {
      fetchCollections();
      if (product) {
        fillFormWithProduct(product);
      }
    } else {
      // Reset ao fechar
      setError("");
    }
  }, [open, product]);

  const fetchCollections = async () => {
    try {
      const res = await fetch("/response/api/collection", {
        credentials: "include",
      });
      const json = await res.json();
      setCollections(json?.data?.collections ?? []);
    } catch (err) {
      console.error("Erro ao carregar coleções", err);
    }
  };

  const fillFormWithProduct = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price.toString(),
      cost_price: p.cost_price?.toString() || "",
      currency: p.currency,
      collection_id: p.collection_id,
      limited_edition: p.limited_edition,
      is_active: p.is_active,
      case_material: p.specifications.case_material || "",
      case_diameter: p.specifications.case_diameter?.toString() || "",
      movement_type: p.specifications.movement_type || "",
      total_weight: p.specifications.total_weight?.toString() || "",
      glass: p.specifications.glass || "",
    });
  };

  const handlePriceChange = (key: "price" | "cost_price", value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const num = cleaned ? parseInt(cleaned, 10) / 100 : 0;
    setForm((prev) => ({ ...prev, [key]: num.toString() }));
  };

  const formatPrice = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.name || !form.collection_id || !form.price) {
      setError("Preencha os campos obrigatórios: Nome, Coleção e Preço");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/response/api/product/${product?.sku}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          price: parseFloat(form.price),
          cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
          currency: form.currency,
          collection_id: form.collection_id,
          limited_edition: form.limited_edition,
          is_active: form.is_active,
          specifications: {
            case_material: form.case_material.trim() || null,
            case_diameter: form.case_diameter ? parseInt(form.case_diameter) : null,
            movement_type: form.movement_type.trim() || null,
            total_weight: form.total_weight ? parseFloat(form.total_weight) : null,
            glass: form.glass.trim() || null,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Erro ao atualizar relógio");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Falha ao salvar alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const selectedCollection = collections.find((c) => c.id === form.collection_id);

  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6 border-b bg-gradient-to-br from-primary/5 to-primary/3">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Watch className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold tracking-tight">
                Editar Relógio
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                SKU: <span className="font-mono font-semibold">{product.sku}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Informações Básicas */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <Tag className="h-4 w-4" />
              <span>Informações do Produto</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nome do Relógio <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Relógio RICO Diário"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Coleção <span className="text-destructive">*</span></Label>
                <Popover open={collectionOpen} onOpenChange={setCollectionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      {selectedCollection ? selectedCollection.name : "Selecione uma coleção..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar coleção..." />
                      <CommandEmpty>Nenhuma coleção encontrada</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {collections.map((collection) => (
                          <CommandItem
                            key={collection.id}
                            onSelect={() => {
                              setForm((p) => ({ ...p, collection_id: collection.id }));
                              setCollectionOpen(false);
                            }}
                          >
                            <CheckCircle2
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.collection_id === collection.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {collection.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Descrição</Label>
                <Input
                  placeholder="Perfeito para uso cotidiano..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Preço de Venda <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="R$ 299,90"
                  value={form.price ? formatPrice(form.price) : ""}
                  onChange={(e) => handlePriceChange("price", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Custo</Label>
                <Input
                  placeholder="R$ 150,00"
                  value={form.cost_price ? formatPrice(form.cost_price) : ""}
                  onChange={(e) => handlePriceChange("cost_price", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={form.limited_edition}
                  onCheckedChange={(checked) =>
                    setForm((p) => ({ ...p, limited_edition: checked }))
                  }
                />
                <Label className="font-medium">Edição Limitada</Label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) =>
                    setForm((p) => ({ ...p, is_active: checked }))
                  }
                />
                <Label className="font-medium">Ativo no Site</Label>
              </div>
            </div>
          </section>

          {/* Especificações Técnicas */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <Package className="h-4 w-4" />
              <span>Especificações Técnicas</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Material da Caixa</Label>
                <Input
                  placeholder="Aço"
                  value={form.case_material}
                  onChange={(e) => setForm((p) => ({ ...p, case_material: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" /> Diâmetro (mm)
                </Label>
                <Input
                  type="number"
                  placeholder="39"
                  value={form.case_diameter}
                  onChange={(e) => setForm((p) => ({ ...p, case_diameter: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Movimento</Label>
                <Input
                  placeholder="Quartzo"
                  value={form.movement_type}
                  onChange={(e) => setForm((p) => ({ ...p, movement_type: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Weight className="h-4 w-4" /> Peso Total (g)
                </Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={form.total_weight}
                  onChange={(e) => setForm((p) => ({ ...p, total_weight: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Gem className="h-4 w-4" /> Vidro
                </Label>
                <Input
                  placeholder="Safira"
                  value={form.glass}
                  onChange={(e) => setForm((p) => ({ ...p, glass: e.target.value }))}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-muted/30">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="px-8">
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}