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
  MapPin,
  Building2,
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

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  employeeId: string;
}

export default function EmployeeModal({
  open,
  onOpenChange,
  onSuccess,
  employeeId,
}: EmployeeModalProps) {
  const [form, setForm] = React.useState<EmployeeFormData>({
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
  });

  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [toggleLoading, setToggleLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open || !employeeId) {
      setInitialLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      setInitialLoading(true);
      setError("");
      try {
        const res = await fetch(`/response/api/user/profile/${employeeId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erro ao carregar funcionário");
        const json = await res.json();
        const data = json?.data ?? json;

        setForm({
          email: data.email ?? "",
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          phone:
            data.phone
              ?.replace("+55", "")
              .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") ?? "",
          document_number: data.document_number ?? "",
          birth_date: data.birth_date?.split("T")[0] ?? "",
          street: data.street ?? "",
          number: data.number ?? "",
          district: data.district ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          zip_code: data.zip_code ?? "",
          country: data.country ?? "Brasil",
          national_id: data.employee?.national_id ?? data.national_id ?? "",
          department:
            data.employee?.department ?? data.employee?.position ?? "",
          salary: data.employee?.salary?.toString() ?? "",
          currency: data.employee?.currency ?? "BRL",
          role: data.user_roles?.[0]?.role?.name ?? "EMPLOYEE_BRANCH",
          store_code: data.store_code ,
          benefits: Array.isArray(data.employee?.benefits)
            ? data.employee.benefits.join(", ")
            : data.employee?.benefits ?? "",
          emergency_name: data.employee?.emergency_contact?.name ?? "",
          emergency_phone:
            data.employee?.emergency_contact?.phone
              ?.replace("+55", "")
              .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") ?? "",
          is_active: data.is_active ?? true,
        });
      } catch {
        setError("Falha ao carregar dados do funcionário");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEmployee();
  }, [open, employeeId]);

  const handleChange = (key: keyof EmployeeFormData, value: string) => {
    setError("");
    if (key === "phone" || key === "emergency_phone") {
      let num = value.replace(/\D/g, "").slice(0, 11);
      if (num.length > 6)
        num = num.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      else if (num.length > 2) num = num.replace(/(\d{2})(\d+)/, "($1) $2");
      setForm((prev) => ({ ...prev, [key]: num }));
      return;
    }
    if (key === "document_number") {
      setForm((prev) => ({
        ...prev,
        [key]: value.replace(/\D/g, "").slice(0, 11),
      }));
      return;
    }
    if (key === "zip_code") {
      const num = value.replace(/\D/g, "").slice(0, 8);
      const formatted =
        num.length > 5 ? `${num.slice(0, 5)}-${num.slice(5)}` : num;
      setForm((prev) => ({ ...prev, [key]: formatted }));
      return;
    }
    if (key === "salary") {
      setForm((prev) => ({ ...prev, [key]: value.replace(/\D/g, "") }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleActive = async () => {
    setToggleLoading(true);
    try {
      const action = form.is_active ? "deactivate" : "activate";
      const res = await fetch(`/response/api/user/${action}/${employeeId}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setForm((prev) => ({ ...prev, is_active: !prev.is_active }));
      onSuccess?.();
    } catch {
      setError("Erro ao alterar status");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("Nome e sobrenome são obrigatórios");
      return;
    }
    setLoading(true);
    try {
      const cleanedPhone = form.phone.replace(/\D/g, "");
      const cleanedEmergency = form.emergency_phone.replace(/\D/g, "");

      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: cleanedPhone ? `+55${cleanedPhone}` : undefined,
        birth_date: form.birth_date || undefined,
        street: form.street || undefined,
        number: form.number || undefined,
        district: form.district || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zip_code: form.zip_code.replace(/\D/g, "") || undefined,
        country: form.country,
        department: form.department || undefined,
        salary: Number(form.salary) || 0,
        currency: form.currency,
        role: form.role,
        store_code: form.store_code,
        benefits: form.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
        emergency_contact: form.emergency_name
          ? {
              name: form.emergency_name.trim(),
              phone: cleanedEmergency ? `+55${cleanedEmergency}` : undefined,
            }
          : undefined,
        is_active: form.is_active,
      };

      console.log(payload)

      const res = await fetch(`/response/api/employee/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      setError("Erro ao salvar as alterações");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl">
          <div className="flex items-center justify-center h-96 text-lg text-muted-foreground">
            Carregando funcionário...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6 border-b bg-gradient-to-br from-primary/5 to-primary/3">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <User className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold">
                Editar Funcionário
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Atualize os dados do funcionário
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

            <section className="space-y-6">
              <div className="flex items-center gap-3 font-semibold">
                <User className="h-5 w-5" />
                <span>Informações Pessoais</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={form.email} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Celular</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="(11) 91234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={form.first_name}
                    onChange={(e) =>
                      handleChange("first_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sobrenome *</Label>
                  <Input
                    value={form.last_name}
                    onChange={(e) =>
                      handleChange("last_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) =>
                      handleChange("birth_date", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Documento</Label>
                  <Input
                    value={form.document_number}
                    onChange={(e) =>
                      handleChange("document_number", e.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 font-semibold">
                <MapPin className="h-5 w-5" />
                <span>Endereço</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Rua</Label>
                  <Input
                    value={form.street}
                    onChange={(e) =>
                      handleChange("street", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input
                    value={form.number}
                    onChange={(e) =>
                      handleChange("number", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    value={form.district}
                    onChange={(e) =>
                      handleChange("district", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={form.city}
                    onChange={(e) =>
                      handleChange("city", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input
                    value={form.state}
                    onChange={(e) =>
                      handleChange("state", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input
                    value={form.zip_code}
                    onChange={(e) =>
                      handleChange("zip_code", e.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 font-semibold">
                <Building2 className="h-5 w-5" />
                <span>Informações Profissionais</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Salário (R$)</Label>
                  <Input
                    value={form.salary}
                    onChange={(e) => handleChange("salary", e.target.value)}
                    placeholder="1890"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Código da Loja</Label>
                  <Input
                    value={form.store_code}
                    onChange={(e) =>
                      handleChange("store_code", e.target.value)
                    }
                    placeholder="BRA001"
                    className="font-mono text-lg font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Função</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={form.role}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, role: e.target.value }))
                    }
                  >
                    <option value="EMPLOYEE_HQ">Funcionário Matriz</option>
                    <option value="EMPLOYEE_BRANCH">Funcionário Filial</option>
                    <option value="MANAGER_BRANCH">Gerente de Filial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Benefícios (separados por vírgula)</Label>
                  <Input
                    value={form.benefits}
                    onChange={(e) =>
                      handleChange("benefits", e.target.value)
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-3 border-t bg-muted/30 flex justify-between items-center">
          <Button
            variant={form.is_active ? "destructive" : "default"}
            onClick={handleToggleActive}
            disabled={toggleLoading || loading}
          >
            {toggleLoading
              ? "Processando..."
              : form.is_active
              ? "Desativar"
              : "Ativar"}
            {form.is_active ? (
              <PowerOff className="ml-2 h-4 w-4" />
            ) : (
              <Power className="ml-2 h-4 w-4" />
            )}
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
