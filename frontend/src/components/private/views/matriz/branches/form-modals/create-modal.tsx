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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Building2, Mail, Phone, MapPin, Clock, Globe } from "lucide-react";

interface CreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export default function CreateModal({
  open,
  onOpenChange,
  onCreated,
}: CreateModalProps) {
  const [form, setForm] = React.useState({
    name: "",
    type: "BRANCH",
    email: "",
    phone: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
    zip_code: "",
    country: "BR",
    latitude: "",
    longitude: "",
    opening_hours: [{ day: "Monday", open: "", close: "" }],
  });

  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

const handleChange = (key: string, value: string) => {
  setError("");

  // Validação para CEP (formato: 00000-000)
  if (key === "zip_code") {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 8) {
      const formatted =
        cleaned.length > 5
          ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
          : cleaned;
      setForm((prev) => ({ ...prev, [key]: formatted }));
    }
    return;
  }

  // Validação para número (apenas dígitos)
  if (key === "number") {
    const cleaned = value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [key]: cleaned }));
    return;
  }

  // Limites máximos de caracteres
  const MAX_LAT_LENGTH = 8; // ex: -90.0000
  const MAX_LON_LENGTH = 9; // ex: -180.0000

  // Função auxiliar para adicionar ponto automaticamente
  const formatCoordinate = (val: string, maxLength: number) => {
    let sanitized = val.replace(/[^0-9\-]/g, ""); // remove tudo que não for dígito ou "-"
    if (sanitized.length > maxLength) sanitized = sanitized.slice(0, maxLength);
    // Adiciona ponto decimal se tiver mais de 2 dígitos (ex: -905432 -> -90.5432)
    if (!sanitized.includes(".") && sanitized.length > 2) {
      const negative = sanitized.startsWith("-");
      const numPart = negative ? sanitized.slice(1) : sanitized;
      const integer = numPart.length <= 2 ? numPart : numPart.slice(0, 2);
      const decimal = numPart.length > 2 ? numPart.slice(2) : "";
      sanitized = (negative ? "-" : "") + integer + (decimal ? "." + decimal : "");
    }
    return sanitized;
  };

  // Validação para latitude (-90 a 90)
  if (key === "latitude") {
    if (value === "" || value === "-") {
      setForm((prev) => ({ ...prev, [key]: value }));
      return;
    }
    const formatted = formatCoordinate(value, MAX_LAT_LENGTH);
    const num = parseFloat(formatted);
    if (!isNaN(num) && num >= -90 && num <= 90) {
      setForm((prev) => ({ ...prev, [key]: formatted }));
    }
    return;
  }

  // Validação para longitude (-180 a 180)
  if (key === "longitude") {
    if (value === "" || value === "-") {
      setForm((prev) => ({ ...prev, [key]: value }));
      return;
    }
    const formatted = formatCoordinate(value, MAX_LON_LENGTH);
    const num = parseFloat(formatted);
    if (!isNaN(num) && num >= -180 && num <= 180) {
      setForm((prev) => ({ ...prev, [key]: formatted }));
    }
    return;
  }

  setForm((prev) => ({ ...prev, [key]: value }));
};


  const handleOpeningHoursChange = (field: string, value: string) => {
    const updated = [...form.opening_hours];
    updated[0][field as keyof (typeof updated)[0]] = value;
    setForm((prev) => ({ ...prev, opening_hours: updated }));
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!form.name || !form.email) {
      setError("Por favor, preencha os campos obrigatórios (Nome e Email)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/response/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: Number(form.latitude) || 0,
          longitude: Number(form.longitude) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao criar a filial");
      }

      setForm({
        name: "",
        type: "BRANCH",
        email: "",
        phone: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        latitude: "",
        longitude: "",
        opening_hours: [{ day: "Monday", open: "", close: "" }],
      });
      onOpenChange(false);

      if (onCreated) onCreated();
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Falha ao criar filial. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden p-0 gap-0 ">
        <DialogHeader className="px-8 pt-8 pb-6 space-y-4 border-b bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold tracking-tight">
                Nova Filial
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Cadastre uma nova unidade da sua empresa
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-180px)] px-8 py-6">
          <div className="space-y-8">
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                <Building2 className="h-4 w-4" />
                <span>Informações Básicas</span>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    Nome da Filial <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Filial Centro"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-11 transition-all hover:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="filial@empresa.com.br"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-11 transition-all hover:border-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="(11) 4399-1998"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="h-11 transition-all hover:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" />
                    País
                  </Label>
                  <Input
                    id="country"
                    placeholder="BR"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="h-11 transition-all hover:border-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>Endereço</span>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="street" className="text-sm font-medium">Rua</Label>
                    <Input
                      id="street"
                      placeholder="Av. Paulista"
                      value={form.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-sm font-medium">Número</Label>
                    <Input
                      id="number"
                      placeholder="1000"
                      value={form.number}
                      onChange={(e) => handleChange("number", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-medium">Bairro</Label>
                    <Input
                      id="district"
                      placeholder="Bela Vista"
                      value={form.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">Estado</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      value={form.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip_code" className="text-sm font-medium">CEP</Label>
                    <Input
                      id="zip_code"
                      placeholder="01310-100"
                      value={form.zip_code}
                      onChange={(e) => handleChange("zip_code", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-sm font-medium">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="-23.561414"
                      value={form.latitude}
                      onChange={(e) => handleChange("latitude", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-sm font-medium">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="-46.655881"
                      value={form.longitude}
                      onChange={(e) => handleChange("longitude", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                <Clock className="h-4 w-4" />
                <span>Horário de Funcionamento</span>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Abertura</Label>
                  <Input
                    type="time"
                    value={form.opening_hours[0].open}
                    onChange={(e) => handleOpeningHoursChange("open", e.target.value)}
                    className="h-11 transition-all hover:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Fechamento</Label>
                  <Input
                    type="time"
                    value={form.opening_hours[0].close}
                    onChange={(e) => handleOpeningHoursChange("close", e.target.value)}
                    className="h-11 transition-all hover:border-primary/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 border-t bg-muted/30 backdrop-blur-sm flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="px-8 h-11 hover:bg-background"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="px-8 h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Criando...
              </span>
            ) : (
              "Criar Filial"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}