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

interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

interface StoreFormData {
  name: string;
  code: string;
  type: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: string;
  longitude: string;
  opening_hours: OpeningHour[];
}

interface VisualizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  storeId?: string;
}

const DEFAULT_FORM_STATE: StoreFormData = {
  name: "",
  code: "",
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
  opening_hours: [{ day: "", open: "", close: "" }],
};

export default function VisualizationModal({
  open,
  onOpenChange,
  onSuccess,
  storeId,
}: VisualizationModalProps) {
  const [form, setForm] = React.useState<StoreFormData>(DEFAULT_FORM_STATE);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(false);

  const isEditing = !!storeId;
  const modalTitle = isEditing ? "Editar Filial" : "Nova Filial";
  const submitButtonText = isEditing ? "Salvar Alterações" : "Criar Filial";
  const submitMethod = isEditing ? "PUT" : "POST";
  const endpoint = isEditing ? `/response/api/store/${storeId}` : "/response/api/store";

  const formatCoordinate = (val: string, maxLength: number, maxAbsValue: number): string => {
    let sanitized = val.replace(/[^0-9\-\.]/g, "");
    const hasMinus = sanitized.startsWith("-");
    let numPart = sanitized.replace("-", "");
    if (numPart.length > maxLength) numPart = numPart.slice(0, maxLength);
    const dotIndex = numPart.indexOf(".");
    if (dotIndex !== -1) {
      numPart = numPart.slice(0, dotIndex + 1) + numPart.slice(dotIndex + 1).replace(/\./g, "");
    }
    let finalValue = (hasMinus ? "-" : "") + numPart;
    const num = parseFloat(finalValue);
    if (!isNaN(num) && Math.abs(num) > maxAbsValue) {
      const maxInt = Math.floor(maxAbsValue).toString();
      const parts = numPart.split(".");
      if (parts[0].length > maxInt.length) {
        parts[0] = maxInt;
      }
      finalValue = (hasMinus ? "-" : "") + parts.join(".");
    }
    return finalValue;
  };

  React.useEffect(() => {
    if (open && storeId) {
      const fetchStoreData = async () => {
        setInitialLoading(true);
        setError("");
        try {
          const response = await fetch(`/response/api/store/${storeId}`, {
            credentials: "include",
          });

          console.log("ID RECEBIDO NO MODAL:", storeId);
          if (!response.ok) {
            throw new Error("Falha ao carregar dados da filial.");
          }
          const json = await response.json();
          const data = json?.data ?? json;

          setForm({
            name: data.name ?? "",
            code: data.code ?? "",
            type: data.type ?? "BRANCH",
            email: data.email ?? "",
            phone: data.phone ?? "",
            street: data.street ?? "",
            number: data.number ?? "",
            district: data.district ?? "",
            city: data.city ?? "",
            state: data.state ?? "",
            zip_code: data.zip_code ?? "",
            country: data.country ?? "BR",
            latitude:
              data.latitude === null || data.latitude === undefined
                ? ""
                : String(data.latitude),
            longitude:
              data.longitude === null || data.longitude === undefined
                ? ""
                : String(data.longitude),
            opening_hours:
              Array.isArray(data.opening_hours) && data.opening_hours.length > 0
                ? data.opening_hours.map((h: any) => ({
                    day: h.day ?? "",
                    open: h.open ?? "",
                    close: h.close ?? "",
                  }))
                : DEFAULT_FORM_STATE.opening_hours,
          });
        } catch (err: any) {
          setError(err?.message ?? "Não foi possível carregar os dados.");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchStoreData();
    } else if (!storeId) {
      setForm(DEFAULT_FORM_STATE);
    }
  }, [open, storeId]);

  const handleChange = (key: keyof StoreFormData, value: string) => {
    setError("");

    if (key === "zip_code") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 8) {
        const formatted = cleaned.length > 5 ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}` : cleaned;
        setForm((prev) => ({ ...prev, [key]: formatted }));
      }
      return;
    }

    if (key === "number") {
      const cleaned = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [key]: cleaned }));
      return;
    }

    if (key === "phone") {
      const isInternational = value.startsWith("+");
      let cleaned = isInternational ? value.replace(/[^\d+]/g, "").replace(/(\+{2,})/g, "+") : value.replace(/\D/g, "");

      if (isInternational) {
        if (cleaned.length > 17) cleaned = cleaned.slice(0, 17);
        let numPart = cleaned.slice(1);
        let temp = "";
        temp += numPart.slice(0, 2);
        numPart = numPart.slice(2);
        if (numPart.length > 0) temp += (temp ? " " : "") + numPart.slice(0, 2);
        numPart = numPart.slice(2);
        if (numPart.length > 0) temp += (temp ? " " : "") + numPart.slice(0, 5);
        numPart = numPart.slice(5);
        if (numPart.length > 0) temp += "-" + numPart.slice(0, 4);
        setForm((prev) => ({ ...prev, [key]: "+" + temp }));
        return;
      } else {
        if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
        let temp = cleaned;
        if (temp.length > 2) temp = temp.slice(0, 2) + " " + temp.slice(2);
        if (temp.length > 8) temp = temp.slice(0, 8) + "-" + temp.slice(8);
        setForm((prev) => ({ ...prev, [key]: temp }));
        return;
      }
    }

    const MAX_LAT_LENGTH = 10;
    const MAX_LON_LENGTH = 11;

    if (key === "latitude") {
      if (value === "" || value === "-") {
        setForm((prev) => ({ ...prev, [key]: value }));
        return;
      }
      const formatted = formatCoordinate(value, MAX_LAT_LENGTH, 90);
      const num = parseFloat(formatted);
      if (!isNaN(num) && num >= -90 && num <= 90) {
        setForm((prev) => ({ ...prev, [key]: formatted }));
      }
      return;
    }

    if (key === "longitude") {
      if (value === "" || value === "-") {
        setForm((prev) => ({ ...prev, [key]: value }));
        return;
      }
      const formatted = formatCoordinate(value, MAX_LON_LENGTH, 180);
      const num = parseFloat(formatted);
      if (!isNaN(num) && num >= -180 && num <= 180) {
        setForm((prev) => ({ ...prev, [key]: formatted }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpeningHoursChange = (index: number, field: "open" | "close", value: string) => {
    const updated = [...form.opening_hours];
    if (!updated[index]) updated[index] = { day: "", open: "", close: "" };
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, opening_hours: updated }));
  };

  const addOpeningHour = () => {
    setForm((prev) => ({ ...prev, opening_hours: [...prev.opening_hours, { day: "", open: "", close: "" }] }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const lat = form.latitude !== "" ? Number(form.latitude) : null;
      const lon = form.longitude !== "" ? Number(form.longitude) : null;

      const payload: any = {
        ...form,
        latitude: lat,
        longitude: lon,
      };

      const response = await fetch(endpoint, {
        method: submitMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error((data && (data.message || data.error)) || "Erro ao salvar");
      }

      if (!isEditing) setForm(DEFAULT_FORM_STATE);

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar");
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
                {modalTitle}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isEditing ? "Edite as informações da unidade" : "Cadastre uma nova unidade da sua empresa"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-180px)] px-8 py-6">
          <div className="space-y-8">
            {initialLoading ? (
              <div className="flex items-center justify-center h-48">
                <span className="animate-spin text-primary mr-3">⏳</span>
                <span className="text-muted-foreground">Carregando dados da filial...</span>
              </div>
            ) : (
              <>
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

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-medium flex items-center gap-2">
                        Código
                      </Label>
                      <Input
                        id="code"
                        placeholder="FILIAL-01"
                        value={form.code}
                        onChange={(e) => handleChange("code", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                        Nome da Filial
                      </Label>
                      <Input
                        id="name"
                        placeholder="Filial Centro"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        Email
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
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Ex: +55 11 98765-4321 ou 11 98765-4321"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
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
                          type="text"
                          inputMode="decimal"
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
                          type="text"
                          inputMode="decimal"
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

                  <div className="space-y-4">
                    {form.opening_hours.map((h, idx) => (
                      <div key={idx} className="grid grid-cols-4 gap-4 items-center">
                        <div className="col-span-2 space-y-2">
                          <Label className="text-sm font-medium">Abertura</Label>
                          <Input
                            type="time"
                            value={h.open}
                            onChange={(e) => handleOpeningHoursChange(idx, "open", e.target.value)}
                            className="h-11 transition-all hover:border-primary/50"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label className="text-sm font-medium">Fechamento</Label>
                          <Input
                            type="time"
                            value={h.close}
                            onChange={(e) => handleOpeningHoursChange(idx, "close", e.target.value)}
                            className="h-11 transition-all hover:border-primary/50"
                          />
                        </div>
                      </div>
                    ))}

                    <div>
                      <Button onClick={addOpeningHour} className="h-10 px-4">
                        Adicionar Horário
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-2 border-t bg-muted/30 backdrop-blur-sm flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || initialLoading}
            className="px-8 h-11 hover:bg-background"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || initialLoading}
            className="px-8 h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                {isEditing ? "Salvando..." : "Criando..."}
              </span>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
