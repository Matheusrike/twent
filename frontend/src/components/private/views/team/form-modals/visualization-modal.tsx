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
  AlertCircle,
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
  Power,
  PowerOff,
} from "lucide-react";

interface EmployeeFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  document_number: string;
  birth_date: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  national_id: string;
  department: string;
  salary: string;
  currency: string;
  role: string;
  store_code: string;
  benefits: string;
  emergency_name: string;
  emergency_phone: string;
  is_active: boolean;
}

const DEFAULT_FORM_STATE: EmployeeFormData = {
  email: "",
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
  role: "",
  store_code: "",
  benefits: "",
  emergency_name: "",
  emergency_phone: "",
  is_active: true,
};

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  employeeId?: string;
}

export default function EmployeeModal({
  open,
  onOpenChange,
  onSuccess,
  employeeId,
}: EmployeeModalProps) {
  const [form, setForm] = React.useState<EmployeeFormData>(DEFAULT_FORM_STATE);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(false);
  const [toggleLoading, setToggleLoading] = React.useState(false);

  const isEditing = !!employeeId;
  const modalTitle = isEditing ? "Editar Funcionário" : "Novo Funcionário";
  const submitButtonText = isEditing ? "Salvar Alterações" : "Criar Funcionário";
  const submitMethod = isEditing ? "PUT" : "POST";
  const endpoint =
    `/response/api/employee/${employeeId}`


  React.useEffect(() => {
    if (open && employeeId) {
      const fetchEmployeeData = async () => {
        setInitialLoading(true);
        setError("");
        try {
          const response = await fetch(`/response/api/user/profile/${employeeId}`, {
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Falha ao carregar dados do funcionário.");
          }

          const json = await response.json();
          const data = json?.data ?? json;

          setForm({
            email: data.email ?? "",
            first_name: data.first_name ?? "",
            last_name: data.last_name ?? "",
            phone: data.phone ?? "",
            document_number: data.document_number ?? "",
            birth_date: data.birth_date ?? "",
            street: data.street ?? "",
            number: data.number ?? "",
            district: data.district ?? "",
            city: data.city ?? "",
            state: data.state ?? "",
            zip_code: data.zip_code ?? "",
            country: data.country ?? "Brasil",
            national_id: data.employee?.national_id ?? "",
            department: data.employee?.department ?? "",
            salary: data.employee?.salary ?? "",
            currency: data.employee?.currency ?? "BRL",
            role: data.user_roles?.[0]?.role?.name ?? "EMPLOYEE_HQ",
            store_code: data.store?.code ?? "",
            benefits: Array.isArray(data.employee?.benefits)
              ? data.employee.benefits.join(", ")
              : "",
            emergency_name: data.employee?.emergency_contact?.name ?? "",
            emergency_phone: data.employee?.emergency_contact?.phone ?? "",
            is_active: data.is_active ?? true,
          });
        } catch (err: any) {
          setError(err?.message ?? "Não foi possível carregar os dados.");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchEmployeeData();
    } else if (!employeeId) {
      setForm(DEFAULT_FORM_STATE);
    }
  }, [open, employeeId]);

  const handleChange = (key: keyof EmployeeFormData, value: string) => {
    setError("");

    if (key === "phone" || key === "emergency_phone") {
      let cleaned = value.replace(/\D/g, "");
      if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
      if (cleaned.length > 6) {
        cleaned = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else if (cleaned.length > 2) {
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
      const formatted =
        cleaned.length > 5
          ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
          : cleaned;
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

  const handleToggleActive = async () => {
    if (!employeeId) return;

    setToggleLoading(true);
    setError("");

    try {
      const action = form.is_active ? "deactivate" : "activate";
      const response = await fetch(`/response/api/user/${action}/${employeeId}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          (data && (data.message || data.error)) ||
            `Erro ao ${action === "activate" ? "ativar" : "desativar"} funcionário`
        );
      }

      setForm((prev) => ({ ...prev, is_active: !prev.is_active }));

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Erro ao alterar status do funcionário");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.email || !form.first_name || !form.last_name) {
      setError("Preencha todos os campos obrigatórios: Email, Nome e Sobrenome");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
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
        is_active: form.is_active,
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
      };

      // Somente inclui o email no payload se for criação
      if (!isEditing) {
        payload.email = form.email;
      }

      const response = await fetch(endpoint, {
        method: submitMethod,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          (data && (data.message || data.error)) || "Erro ao salvar"
        );
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
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6 space-y-4 border-b bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight">
                  {modalTitle}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {isEditing
                    ? "Edite as informações do funcionário"
                    : "Cadastre um novo membro da equipe"}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-180px)] px-8 py-6">
          <div className="space-y-8">
            {initialLoading ? (
              <div className="flex items-center justify-center h-48">
                <span className="animate-spin text-primary mr-3">⏳</span>
                <span className="text-muted-foreground">
                  Carregando dados do funcionário...
                </span>
              </div>
            ) : (
              <>
                {error && (
                  <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Informações Pessoais */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                    <User className="h-4 w-4" />
                    <span>Informações Pessoais</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="funcionario@empresa.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        disabled={isEditing}
                        className="h-11 transition-all hover:border-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        Celular
                      </Label>
                      <Input
                        id="phone"
                        placeholder="(11) 98765-4321"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-sm font-medium">
                        Nome <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="first_name"
                        placeholder="João"
                        value={form.first_name}
                        onChange={(e) => handleChange("first_name", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-sm font-medium">
                        Sobrenome <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="last_name"
                        placeholder="Silva"
                        value={form.last_name}
                        onChange={(e) => handleChange("last_name", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="birth_date" className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Data de Nascimento
                      </Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={form.birth_date}
                        onChange={(e) => handleChange("birth_date", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document_number" className="text-sm font-medium flex items-center gap-2">
                        <CreditCard className="h-3.5 w-3.5" />
                        CPF
                      </Label>
                      <Input
                        id="document_number"
                        placeholder="12345678900"
                        value={form.document_number}
                        onChange={(e) => handleChange("document_number", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="national_id" className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" />
                      RG
                    </Label>
                    <Input
                      id="national_id"
                      placeholder="123456789"
                      value={form.national_id}
                      onChange={(e) => handleChange("national_id", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Endereço */}
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
                          placeholder="Rua das Flores"
                          value={form.street}
                          onChange={(e) => handleChange("street", e.target.value)}
                          className="h-11 transition-all hover:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number" className="text-sm font-medium">Número</Label>
                        <Input
                          id="number"
                          placeholder="120"
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
                          placeholder="Centro"
                          value={form.district}
                          onChange={(e) => handleChange("district", e.target.value)}
                          className="h-11 transition-all hover:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">Cidade</Label>
                        <Input
                          id="city"
                          placeholder="Santo André"
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip_code" className="text-sm font-medium">CEP</Label>
                        <Input
                          id="zip_code"
                          placeholder="09010-000"
                          value={form.zip_code}
                          onChange={(e) => handleChange("zip_code", e.target.value)}
                          className="h-11 transition-all hover:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium">País</Label>
                        <Input
                          id="country"
                          placeholder="Brasil"
                          value={form.country}
                          onChange={(e) => handleChange("country", e.target.value)}
                          className="h-11 transition-all hover:border-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações Profissionais */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                    <Building2 className="h-4 w-4" />
                    <span>Informações Profissionais</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium">Departamento</Label>
                      <Input
                        id="department"
                        placeholder="Vendas"
                        value={form.department}
                        onChange={(e) => handleChange("department", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary" className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5" />
                        Salário
                      </Label>
                      <Input
                        id="salary"
                        placeholder="3500"
                        value={form.salary}
                        onChange={(e) => handleChange("salary", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store_code" className="text-sm font-medium">Código da Loja</Label>
                      <Input
                        id="store_code"
                        placeholder="BRA008"
                        value={form.store_code}
                        onChange={(e) => handleChange("store_code", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">Função (Role)</Label>
                      <select
                        id="role"
                        className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:border-primary/50"
                        value={form.role}
                        onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                      >
                        <option value="EMPLOYEE_HQ">EMPLOYEE_HQ</option>
                        <option value="EMPLOYEE_BRANCH">EMPLOYEE_BRANCH</option>
                        <option value="MANAGER_BRANCH">MANAGER_BRANCH</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm font-medium">Moeda</Label>
                      <Input
                        id="currency"
                        placeholder="BRL"
                        value={form.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits" className="text-sm font-medium">
                      Benefícios (separados por vírgula)
                    </Label>
                    <Input
                      id="benefits"
                      placeholder="Vale Alimentação, Plano de Saúde"
                      value={form.benefits}
                      onChange={(e) => handleChange("benefits", e.target.value)}
                      className="h-11 transition-all hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Contato de Emergência */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                    <HeartHandshake className="h-4 w-4" />
                    <span>Contato de Emergência</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_name" className="text-sm font-medium">Nome</Label>
                      <Input
                        id="emergency_name"
                        placeholder="Maria Souza"
                        value={form.emergency_name}
                        onChange={(e) => handleChange("emergency_name", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone" className="text-sm font-medium">Telefone</Label>
                      <Input
                        id="emergency_phone"
                        placeholder="(11) 99876-5432"
                        value={form.emergency_phone}
                        onChange={(e) => handleChange("emergency_phone", e.target.value)}
                        className="h-11 transition-all hover:border-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-3 border-t  flex justify-between gap-3">
          <div>
            {isEditing && (
              <Button
                variant={form.is_active ? "destructive" : "default"}
                onClick={handleToggleActive}
                disabled={loading || initialLoading || toggleLoading}
                className="px-6 h-11"
              >
                {toggleLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {form.is_active ? (
                      <>
                        <PowerOff className="h-4 w-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4" />
                        Ativar
                      </>
                    )}
                  </span>
                )}
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || initialLoading || toggleLoading}
              className="px-8 h-11 hover:bg-background"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || initialLoading || toggleLoading}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}