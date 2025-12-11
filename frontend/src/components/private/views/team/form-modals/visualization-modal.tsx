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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  User,
  MapPin,
  Building2,
  CreditCard,
  HeartHandshake,
  Phone,
  Mail,
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
  // Estado para armazenar os dados originais
  const [originalForm, setOriginalForm] = React.useState<EmployeeFormData | null>(null);
  const [originalSelectedBenefits, setOriginalSelectedBenefits] = React.useState<string[]>([]);
  
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
  const [stores, setStores] = React.useState<Array<{ id: string; code: string; name: string }>>([]);
  const [loadingStores, setLoadingStores] = React.useState(false);
  const [selectedBenefits, setSelectedBenefits] = React.useState<string[]>([]);
  
  const commonBenefits = [
    'Vale Alimentação',
    'Vale Refeição',
    'Vale Transporte',
    'Plano de Saúde',
    'Plano Odontológico',
    'Auxílio Creche',
    'Gympass',
    'Seguro de Vida',
    'Participação nos Lucros',
    'Auxílio Home Office',
    'Auxílio Educação',
    'Vale Combustível',
    '13º Salário',
    'Férias Remuneradas',
    'Bônus Anual',
    'Auxílio Estacionamento',
    'Auxílio Internet',
    'Auxílio Celular',
    'Plano de Previdência',
    'Auxílio Moradia',
    'Ticket Cultura',
    'Auxílio Academia',
  ];

  // Buscar lojas quando o modal abrir
  React.useEffect(() => {
    if (open) {
      const fetchStores = async () => {
        setLoadingStores(true);
        try {
          const response = await fetch('/response/api/store', {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Falha ao carregar lojas');
          }

          const json = await response.json();
          const storesData = json?.data || [];
          setStores(storesData.map((store: any) => ({
            id: store.id,
            code: store.code,
            name: store.name,
          })));
        } catch (err: any) {
          setError(err.message || 'Erro ao carregar lojas');
        } finally {
          setLoadingStores(false);
        }
      };

      fetchStores();
    }
  }, [open]);

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

        const formData = {
          email: data.email ?? "",
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          phone:
            data.phone
              ?.replace("+55", "")
              .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") ?? "",
          document_number: data.document_number 
            ? data.document_number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
            : "",
          birth_date: data.birth_date?.split("T")[0] ?? "",
          street: data.street ?? "",
          number: data.number ?? "",
          district: data.district ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          zip_code: data.zip_code 
            ? (data.zip_code.length > 5 ? `${data.zip_code.slice(0, 5)}-${data.zip_code.slice(5)}` : data.zip_code)
            : "",
          country: data.country ?? "Brasil",
          department:
            data.employee?.department ?? data.employee?.position ?? "",
          salary: data.employee?.salary 
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(data.employee.salary))
            : "",
          currency: data.employee?.currency ?? "BRL",
          role: data.user_roles?.[0]?.role?.name ?? "EMPLOYEE_BRANCH",
          store_code: data.store?.code ?? data.store_code ?? "",
          benefits: (() => {
            const benefitsArray = Array.isArray(data.employee?.benefits)
              ? data.employee.benefits
              : data.employee?.benefits
              ? [data.employee.benefits]
              : [];
            
            const common = benefitsArray.filter((b: string) => commonBenefits.includes(b));
            const custom = benefitsArray.filter((b: string) => !commonBenefits.includes(b));
            
            setSelectedBenefits(common);
            setOriginalSelectedBenefits(common);
            return custom.join(", ");
          })(),
          emergency_name: data.employee?.emergency_contact?.name ?? "",
          emergency_phone:
            data.employee?.emergency_contact?.phone
              ?.replace("+55", "")
              .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") ?? "",
          is_active: data.is_active ?? true,
        };
        
        setForm(formData);
        setOriginalForm(formData);
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

    // TELEFONE
    if (key === "phone" || key === "emergency_phone") {
      let cleaned = value.replace(/\D/g, "");
      if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);

      if (cleaned.length > 6) cleaned = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      else if (cleaned.length > 2) cleaned = cleaned.replace(/(\d{2})(\d+)/, "($1) $2");

      setForm((prev) => ({ ...prev, [key]: cleaned }));
      return;
    }

    // CPF
    if (key === "document_number") {
      const cleaned = value.replace(/\D/g, "").slice(0, 11);
      let formatted = cleaned;
      if (cleaned.length > 9) {
        formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else if (cleaned.length > 6) {
        formatted = cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
      } else if (cleaned.length > 3) {
        formatted = cleaned.replace(/(\d{3})(\d+)/, "$1.$2");
      }
      setForm((prev) => ({ ...prev, [key]: formatted }));
      return;
    }

    // CEP
    if (key === "zip_code") {
      const cleaned = value.replace(/\D/g, "").slice(0, 8);
      const formatted = cleaned.length > 5 ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}` : cleaned;

      setForm((prev) => ({ ...prev, [key]: formatted }));
      return;
    }

    // SALÁRIO (máscara de dinheiro)
    if (key === "salary") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned === "") {
        setForm((prev) => ({ ...prev, [key]: "" }));
        return;
      }
      // Converte para número e formata como moeda brasileira
      // Trata como centavos (ex: 350000 = R$ 3.500,00)
      const numValue = parseInt(cleaned, 10) / 100;
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numValue);
      setForm((prev) => ({ ...prev, [key]: formatted }));
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("Nome e sobrenome são obrigatórios");
      return;
    }
    if (!form.email.trim()) {
      setError("Email é obrigatório");
      return;
    }
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Por favor, insira um email válido");
      return;
    }
    setLoading(true);
    try {
      if (!originalForm) {
        setError("Erro: dados originais não carregados");
        setLoading(false);
        return;
      }

      const cleanedPhone = form.phone.replace(/\D/g, "");
      const cleanedEmergency = form.emergency_phone.replace(/\D/g, "");
      // Remove R$ e espaços, substitui vírgula por ponto para conversão numérica
      const cleanedSalary = form.salary.replace(/[^\d,]/g, "").replace(",", ".");

      // Compara valores e só inclui campos que mudaram
      const payload: any = {};

      // Nome e sobrenome - sempre envia (obrigatórios)
      payload.first_name = form.first_name.trim();
      payload.last_name = form.last_name.trim();

      // Email - só envia se mudou
      const normalizedEmail = form.email.trim().toLowerCase();
      const originalEmail = originalForm.email.trim().toLowerCase();
      if (normalizedEmail !== originalEmail) {
        payload.email = normalizedEmail;
      }

      // Telefone - só envia se mudou
      const newPhone = cleanedPhone ? `+55${cleanedPhone}` : undefined;
      const originalPhoneCleaned = originalForm.phone.replace(/\D/g, "");
      const originalPhone = originalPhoneCleaned ? `+55${originalPhoneCleaned}` : undefined;
      if (newPhone !== originalPhone) {
        payload.phone = newPhone;
      }

      // Data de nascimento - só envia se mudou
      if (form.birth_date !== originalForm.birth_date) {
        payload.birth_date = form.birth_date || undefined;
      }

      // Endereço - só envia campos que mudaram
      if (form.street !== originalForm.street) payload.street = form.street || undefined;
      if (form.number !== originalForm.number) payload.number = form.number || undefined;
      if (form.district !== originalForm.district) payload.district = form.district || undefined;
      if (form.city !== originalForm.city) payload.city = form.city || undefined;
      if (form.state !== originalForm.state) payload.state = form.state || undefined;
      const newZipCode = form.zip_code.replace(/\D/g, "") || undefined;
      const originalZipCode = originalForm.zip_code.replace(/\D/g, "") || undefined;
      if (newZipCode !== originalZipCode) {
        payload.zip_code = newZipCode;
      }
      if (form.country !== originalForm.country) {
        payload.country = form.country;
      }

      // Informações profissionais - só envia se mudaram
      if (form.department !== originalForm.department) {
        payload.department = form.department || undefined;
      }
      
      const newSalary = cleanedSalary ? Number(cleanedSalary) : 0;
      const originalSalaryCleaned = originalForm.salary.replace(/[^\d,]/g, "").replace(",", ".");
      const originalSalary = originalSalaryCleaned ? Number(originalSalaryCleaned) : 0;
      if (newSalary !== originalSalary) {
        payload.salary = newSalary;
      }
      
      if (form.currency !== originalForm.currency) {
        payload.currency = form.currency;
      }
      
      if (form.role !== originalForm.role) {
        payload.role = form.role;
      }
      
      if (form.store_code !== originalForm.store_code) {
        payload.store_code = form.store_code;
      }

      // Benefícios - só envia se mudaram
      const newBenefits = [
        ...selectedBenefits,
        ...form.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean)
      ].filter(Boolean);
      const originalBenefitsStr = originalForm.benefits || "";
      const originalCustomBenefits = originalBenefitsStr
        ? originalBenefitsStr.split(",").map((b: string) => b.trim()).filter(Boolean)
        : [];
      const originalBenefits = [...originalSelectedBenefits, ...originalCustomBenefits].filter(Boolean);
      
      if (JSON.stringify(newBenefits.sort()) !== JSON.stringify(originalBenefits.sort())) {
        payload.benefits = newBenefits;
      }

      // Contato de emergência - só envia se mudou
      const newEmergencyContact = form.emergency_name
        ? {
            name: form.emergency_name.trim(),
            phone: cleanedEmergency ? `+55${cleanedEmergency}` : undefined,
          }
        : undefined;
      const originalEmergencyName = originalForm.emergency_name?.trim() || "";
      const originalEmergencyPhoneCleaned = originalForm.emergency_phone.replace(/\D/g, "");
      const originalEmergencyPhone = originalEmergencyPhoneCleaned ? `+55${originalEmergencyPhoneCleaned}` : undefined;
      const originalEmergencyContact = originalEmergencyName
        ? {
            name: originalEmergencyName,
            phone: originalEmergencyPhone,
          }
        : undefined;
      
      if (JSON.stringify(newEmergencyContact) !== JSON.stringify(originalEmergencyContact)) {
        payload.emergency_contact = newEmergencyContact;
      }

      // Status - só envia se mudou
      if (form.is_active !== originalForm.is_active) {
        payload.is_active = form.is_active;
      }

      console.log(payload)

      const res = await fetch(`/response/api/employee/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // Se for erro de conflito (dados únicos já em uso), mostra mensagem genérica
        if (res.status === 409) {
          setError("Algum dos dados informados já está em uso. Por favor, verifique e tente novamente.");
          setLoading(false);
          return;
        }
        throw new Error(errorData.message || "Erro ao salvar as alterações");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      // Se o erro de conflito já foi tratado, não sobrescreve
      if (error && error.includes("já está em uso")) {
        return;
      }
      setError(err.message || "Erro ao salvar as alterações");
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
                  <Label className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="funcionario@empresa.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
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
                  <Label className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" /> CPF
                  </Label>
                  <Input
                    placeholder="123.456.789-00"
                    value={form.document_number}
                    disabled
                    className="bg-muted"
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
                    placeholder="09010-000"
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
                  <Label>Salário</Label>
                  <Input
                    placeholder="R$ 3.500,00"
                    value={form.salary}
                    onChange={(e) => handleChange("salary", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Código da Loja *</Label>
                  <Select
                    value={form.store_code}
                    onValueChange={(value) => handleChange("store_code", value)}
                    disabled={loadingStores || loading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={loadingStores ? "Carregando..." : "Selecione uma loja"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.code}>
                          {store.code} - {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Input
                    placeholder="Vendas"
                    value={form.department}
                    onChange={(e) =>
                      handleChange("department", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Função</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
              </div>

              <div className="space-y-2">
                <Label>Benefícios</Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 p-3 border rounded-md bg-muted/30">
                    {commonBenefits.map((benefit) => (
                      <div key={benefit} className="flex items-center space-x-2">
                        <Checkbox
                          id={`benefit-edit-${benefit}`}
                          checked={selectedBenefits.includes(benefit)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBenefits([...selectedBenefits, benefit]);
                            } else {
                              setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`benefit-edit-${benefit}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {benefit}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Outros benefícios (separados por vírgula)
                    </Label>
                    <Input
                      placeholder="Ex: Bônus, Férias flexíveis"
                      value={form.benefits}
                      onChange={(e) =>
                        handleChange("benefits", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* --- EMERGENCIA --- */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <HeartHandshake className="h-4 w-4" />
                <span>Contato de Emergência</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    placeholder="Maria Souza"
                    value={form.emergency_name}
                    onChange={(e) =>
                      handleChange("emergency_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Telefone
                  </Label>
                  <Input
                    placeholder="(11) 99876-5432"
                    value={form.emergency_phone}
                    onChange={(e) =>
                      handleChange("emergency_phone", e.target.value)
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-3 border-t bg-muted/30 flex justify-end gap-3">
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
      </DialogContent>
    </Dialog>
  );
}
