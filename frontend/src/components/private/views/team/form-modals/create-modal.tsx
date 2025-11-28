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
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Building2,
  DollarSign,
  Shield,
  HeartHandshake,
  AlertCircle,
} from "lucide-react";

interface CreateEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export default function CreateEmployeeModal({
  open,
  onOpenChange,
  onCreated,
}: CreateEmployeeModalProps) {
  const [form, setForm] = React.useState({
    email: "",
    password_hash: "",
    first_name: "",
    last_name: "",
    phone: "",
    document_number: "",
    birth_date: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
    zip_code: "",
    country: "Brasil",
    national_id: "",
    department: "",
    salary: "",
    currency: "BRL",
    role: "EMPLOYEE_HQ",
    store_code: "",
    benefits: "",
    emergency_name: "",
    emergency_phone: "",
  });

  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleChange = (key: string, value: string) => {
    setError("");

    // Máscaras e validações
    if (key === "phone" || key === "emergency_phone") {
      let cleaned = value.replace(/\D/g, "");
      if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
      if (cleaned.length <= 11) {
        if (cleaned.length > 6)
          cleaned = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        else if (cleaned.length > 2)
          cleaned = cleaned.replace(/(\d{2})(\d+)/, "($1) $2");
      }
      setForm((prev) => ({ ...prev, [key]: cleaned }));
      return;
    }

    if (key === "document_number") {
      const cleaned = value.replace(/\D/g, "").slice(0, 11);
      setForm((prev) => ({ ...prev, [key]: cleaned }));
      return;
    }

    if (key === "zip_code") {
      const cleaned = value.replace(/\D/g, "").slice(0, 8);
      const formatted = cleaned.length > 5 ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}` : cleaned;
      setForm((prev) => ({ ...prev, [key]: formatted }));
      return;
    }

    if (key === "salary") {
      const cleaned = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [key]: cleaned }));
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.email || !form.password_hash || !form.first_name || !form.last_name) {
      setError("Preencha todos os campos obrigatórios: Email, Senha, Nome e Sobrenome");
      return;
    }

    if (form.password_hash.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/response/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password_hash: form.password_hash,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone.replace(/\D/g, ""),
          user_type: "EMPLOYEE",
          document_number: form.document_number,
          birth_date: form.birth_date || null,
          street: form.street,
          number: form.number,
          district: form.district,
          city: form.city,
          state: form.state,
          zip_code: form.zip_code.replace(/\D/g, ""),
          country: form.country,
          is_active: true,
          national_id: form.national_id,
          department: form.department,
          salary: Number(form.salary) || 0,
          currency: form.currency,
          role: form.role,
          benefits: form.benefits
            .split(",")
            .map((b) => b.trim())
            .filter(Boolean),
          emergency_contact: form.emergency_name
            ? {
                name: form.emergency_name,
                phone: form.emergency_phone.replace(/\D/g, ""),
              }
            : null,
          store: form.store_code ? { code: form.store_code } : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro ao criar funcionário");
      }

      // Reset form
      setForm({
        email: "",
        password_hash: "",
        first_name: "",
        last_name: "",
        phone: "",
        document_number: "",
        birth_date: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        zip_code: "",
        country: "Brasil",
        national_id: "",
        department: "",
        salary: "",
        currency: "BRL",
        role: "EMPLOYEE_HQ",
        store_code: "",
        benefits: "",
        emergency_name: "",
        emergency_phone: "",
      });

      onOpenChange(false);
      onCreated?.();
    } catch (err: any) {
      setError(err.message || "Falha ao criar funcionário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6 border-b bg-gradient-to-br from-primary/5 to-primary/3">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <User className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold tracking-tight">
                Novo Funcionário
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Cadastre um novo membro da equipe
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-180px)] px-8 py-6">
          <div className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Informações Pessoais */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <User className="h-4 w-4" />
                <span>Informações Pessoais</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="funcionario@empresa.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Senha <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password_hash}
                    onChange={(e) => handleChange("password_hash", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="João"
                    value={form.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sobrenome <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Silva"
                    value={form.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Celular
                  </Label>
                  <Input
                    placeholder="(11) 98765-4321"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Data de Nascimento
                  </Label>
                  <Input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) => handleChange("birth_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" /> CPF
                  </Label>
                  <Input
                    placeholder="12345678900"
                    value={form.document_number}
                    onChange={(e) => handleChange("document_number", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Endereço */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <MapPin className="h-4 w-4" />
                <span>Endereço</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Rua</Label>
                  <Input placeholder="Rua das Flores" value={form.street} onChange={(e) => handleChange("street", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input placeholder="120" value={form.number} onChange={(e) => handleChange("number", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input placeholder="Centro" value={form.district} onChange={(e) => handleChange("district", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input placeholder="Santo André" value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input placeholder="SP" value={form.state} onChange={(e) => handleChange("state", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input placeholder="09010-000" value={form.zip_code} onChange={(e) => handleChange("zip_code", e.target.value)} />
                </div>
              </div>
            </section>

            {/* Trabalho */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <Building2 className="h-4 w-4" />
                <span>Informações Profissionais</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Input placeholder="Vendas" value={form.department} onChange={(e) => handleChange("department", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5" /> Salário
                  </Label>
                  <Input placeholder="3500" value={form.salary} onChange={(e) => handleChange("salary", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Código da Loja</Label>
                  <Input placeholder="BRA008" value={form.store_code} onChange={(e) => handleChange("store_code", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Função (Role)</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.role}
                    onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="EMPLOYEE_HQ">EMPLOYEE_HQ</option>
                    <option value="EMPLOYEE_BRANCH">EMPLOYEE_BRANCH</option>
                    <option value="MANAGER">MANAGER_BRANCH</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Benefícios (separados por vírgula)</Label>
                  <Input
                    placeholder="Vale Alimentação, Plano de Saúde"
                    value={form.benefits}
                    onChange={(e) => handleChange("benefits", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Contato de Emergência */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <HeartHandshake className="h-4 w-4" />
                <span>Contato de Emergência</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input placeholder="Maria Souza" value={form.emergency_name} onChange={(e) => handleChange("emergency_name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input placeholder="(11) 99876-5432" value={form.emergency_phone} onChange={(e) => handleChange("emergency_phone", e.target.value)} />
                </div>
              </div>
            </section>
          </div>
        </div>

       <div className="p-2 border-t bg-muted/30 backdrop-blur-sm flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="px-8">
            {loading ? "Criando..." : "Criar Funcionário"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}