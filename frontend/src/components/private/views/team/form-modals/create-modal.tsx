'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    Eye,
    EyeOff,
} from 'lucide-react';

interface CreateEmployeeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

export default function CreateEmployeeModal({ open, onOpenChange, onCreated }: CreateEmployeeModalProps) {
    const [form, setForm] = React.useState({
        email: '',
        password_hash: '',
        first_name: '',
        last_name: '',
        phone: '',
        document_number: '',
        birth_date: '',
        street: '',
        number: '',
        district: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'Brasil',
        national_id: '',
        department: '',
        salary: '',
        currency: 'BRL',
        role: '',
        store_code: '',
        benefits: '',
        emergency_name: '',
        emergency_phone: '',
    });

    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
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

    const handleChange = (key: string, value: string) => {
        setError('');

        // TELEFONE
        if (key === 'phone' || key === 'emergency_phone') {
            let cleaned = value.replace(/\D/g, '');
            if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);

            if (cleaned.length > 6) cleaned = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            else if (cleaned.length > 2) cleaned = cleaned.replace(/(\d{2})(\d+)/, '($1) $2');

            setForm((prev) => ({ ...prev, [key]: cleaned }));
            return;
        }

        // CPF
        if (key === 'document_number') {
            const cleaned = value.replace(/\D/g, '').slice(0, 11);
            let formatted = cleaned;
            if (cleaned.length > 9) {
                formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (cleaned.length > 6) {
                formatted = cleaned.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
            } else if (cleaned.length > 3) {
                formatted = cleaned.replace(/(\d{3})(\d+)/, '$1.$2');
            }
            setForm((prev) => ({ ...prev, [key]: formatted }));
            return;
        }

        // CEP
        if (key === 'zip_code') {
            const cleaned = value.replace(/\D/g, '').slice(0, 8);
            const formatted = cleaned.length > 5 ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}` : cleaned;

            setForm((prev) => ({ ...prev, [key]: formatted }));
            return;
        }

        // SALÁRIO (máscara de dinheiro)
        if (key === 'salary') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned === '') {
                setForm((prev) => ({ ...prev, [key]: '' }));
                return;
            }
            // Converte para número e formata como moeda brasileira
            // Trata como centavos (ex: 350000 = R$ 3.500,00)
            const numValue = parseInt(cleaned, 10) / 100;
            const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numValue);
            setForm((prev) => ({ ...prev, [key]: formatted }));
            return;
        }

        // NATIONAL ID
        if (key === 'national_id') {
            const country = form.country;
            let cleaned: string;

            // BRASIL → CNPJ (apenas números)
            if (country === 'Brasil') {
                cleaned = value.replace(/\D/g, '').slice(0, 14);
                // Aplica máscara de CNPJ: XX.XXX.XXX/XXXX-XX
                if (cleaned.length >= 12) {
                    cleaned = cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                } else if (cleaned.length >= 8) {
                    cleaned = cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
                } else if (cleaned.length >= 5) {
                    cleaned = cleaned.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
                } else if (cleaned.length >= 3) {
                    cleaned = cleaned.replace(/(\d{2})(\d+)/, '$1.$2');
                }
            }
            // USA → EIN (apenas números)
            else if (country === 'USA') {
                cleaned = value.replace(/\D/g, '').slice(0, 9);
                if (cleaned.length > 2) cleaned = cleaned.replace(/(\d{2})(\d+)/, '$1-$2');
            }
            // CHILE → RUT (permite letras no final)
            else if (country === 'Chile') {
                cleaned = value.replace(/[^\d\dkK]/gi, '').slice(0, 9);
                if (cleaned.length >= 8) cleaned = cleaned.replace(/(\d{1,2})(\d{3})(\d{3})([\dkK])/i, '$1.$2.$3-$4');
                else if (cleaned.length >= 5) cleaned = cleaned.replace(/(\d{1,2})(\d{3})(\d+)/, '$1.$2.$3');
                else if (cleaned.length >= 3) cleaned = cleaned.replace(/(\d{1,2})(\d+)/, '$1.$2');
            }
            // Outros países - remove apenas caracteres especiais
            else {
                cleaned = value.replace(/\W/g, '');
            }

            setForm((prev) => ({ ...prev, national_id: cleaned }));
            return;
        }

        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setError('');

        if (!form.email || !form.password_hash || !form.first_name || !form.last_name) {
            setError('Preencha todos os campos obrigatórios: Email, Senha, Nome e Sobrenome');
            return;
        }

        if (form.password_hash.length < 8) {
            setError('A senha deve ter no mínimo 8 caracteres');
            return;
        }

        setLoading(true);

        try {
            const cleanedPhone = form.phone.replace(/\D/g, '');
            const cleanedEmergency = form.emergency_phone.replace(/\D/g, '');
            const cleanedNational = form.national_id.replace(/\W/g, '');
            // Remove R$ e espaços, substitui vírgula por ponto para conversão numérica
            const cleanedSalary = form.salary.replace(/[^\d,]/g, '').replace(',', '.');

            const response = await fetch('/response/api/employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: form.email.trim(),
                    password_hash: form.password_hash,
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                    phone: cleanedPhone ? `+55${cleanedPhone}` : null,
                    user_type: 'EMPLOYEE',
                    document_number: form.document_number.replace(/\D/g, '') || null,
                    birth_date: form.birth_date || null,
                    street: form.street || null,
                    number: form.number || null,
                    district: form.district || null,
                    city: form.city || null,
                    state: form.state || null,
                    zip_code: form.zip_code.replace(/\D/g, '') || null,
                    country: form.country,
                    is_active: true,
                    national_id: cleanedNational || null,
                    department: form.department || null,
                    salary: cleanedSalary ? Number(cleanedSalary) : 0,
                    currency: form.currency,
                    role: form.role || 'EMPLOYEE_BRANCH',
                    store_code: form.store_code || null,
                    benefits: [
                        ...selectedBenefits,
                        ...form.benefits
                            .split(',')
                            .map((b) => b.trim())
                            .filter(Boolean)
                    ].filter(Boolean),
                    emergency_contact: form.emergency_name
                        ? {
                              name: form.emergency_name.trim(),
                              phone: cleanedEmergency ? `+55${cleanedEmergency}` : null,
                          }
                        : null,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                // Se for erro de conflito (dados únicos já em uso), mostra mensagem genérica
                if (response.status === 409) {
                    setError('Algum dos dados informados já está em uso. Por favor, verifique e tente novamente.');
                    setLoading(false);
                    return;
                }
                throw new Error(data.message || data.error);
            }

            setForm({
                email: '',
                password_hash: '',
                first_name: '',
                last_name: '',
                phone: '',
                document_number: '',
                birth_date: '',
                street: '',
                number: '',
                district: '',
                city: '',
                state: '',
                zip_code: '',
                country: 'Brasil',
                national_id: '',
                department: '',
                salary: '',
                currency: 'BRL',
                role: '',
                store_code: '',
                benefits: '',
                emergency_name: '',
                emergency_phone: '',
            });
            setSelectedBenefits([]);

            onOpenChange(false);
            onCreated?.();
        } catch (err: any) {
            // Se o erro de conflito já foi tratado, não sobrescreve
            if (error && error.includes('já está em uso')) {
                return;
            }
            setError(err.message || 'Falha ao criar funcionário. Tente novamente.');
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
                            <DialogTitle className="text-3xl font-bold tracking-tight">Novo Funcionário</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">Cadastre um novo membro da equipe</p>
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

                        {/* --- INFORMACOES PESSOAIS --- */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 text-sm font-semibold">
                                <User className="h-4 w-4" />
                                <span>Informações Pessoais</span>
                                <div className="h-px flex-1 bg-border/50" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" /> Email *
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="funcionario@empresa.com"
                                        value={form.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Shield className="h-3.5 w-3.5" /> Senha *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Mínimo 8 caracteres"
                                            value={form.password_hash}
                                            onChange={(e) => handleChange('password_hash', e.target.value)}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Nome *</Label>
                                    <Input
                                        placeholder="João"
                                        value={form.first_name}
                                        onChange={(e) => handleChange('first_name', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Sobrenome *</Label>
                                    <Input
                                        placeholder="Silva"
                                        value={form.last_name}
                                        onChange={(e) => handleChange('last_name', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5" /> Celular
                                    </Label>
                                    <Input
                                        placeholder="(11) 98765-4321"
                                        value={form.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" /> Data de Nascimento
                                    </Label>
                                    <Input
                                        type="date"
                                        value={form.birth_date}
                                        onChange={(e) => handleChange('birth_date', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <CreditCard className="h-3.5 w-3.5" /> CPF
                                    </Label>
                                    <Input
                                        placeholder="123.456.789-00"
                                        value={form.document_number}
                                        onChange={(e) => handleChange('document_number', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <CreditCard className="h-3.5 w-3.5" /> National ID
                                    </Label>
                                    <Input
                                        placeholder="CNPJ / EIN / RUT"
                                        value={form.national_id}
                                        onChange={(e) => handleChange('national_id', e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* --- ENDERECO --- */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 text-sm font-semibold">
                                <MapPin className="h-4 w-4" />
                                <span>Endereço</span>
                                <div className="h-px flex-1 bg-border/50" />
                            </div>

                            {/* PAÍS */}
                            <div className="space-y-2">
                                <Label>País</Label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={form.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                >
                                    <option value="BR">Brasil</option>
                                    <option value="US">Estados Unidos</option>
                                    <option value="CL">Chile</option>
                                    <option value="AR">Argentina</option>
                                    <option value="MX">México</option>
                                    <option value="CA">Canadá</option>
                                    <option value="GB">Reino Unido</option>
                                    <option value="DE">Alemanha</option>
                                    <option value="FR">França</option>
                                    <option value="PT">Portugal</option>
                                    <option value="JP">Japão</option>
                                    <option value="AU">Austrália</option>
                                    <option value="ES">Espanha</option>
                                    <option value="IT">Itália</option>
                                    <option value="ZA">África do Sul</option>
                                    <option value="CN">China</option>
                                    <option value="KR">Coreia do Sul</option>
                                    <option value="IN">Índia</option>
                                    <option value="RU">Rússia</option>
                                    <option value="NL">Holanda</option>
                                    <option value="SE">Suécia</option>
                                    <option value="NO">Noruega</option>
                                    <option value="DK">Dinamarca</option>
                                    <option value="FI">Finlândia</option>
                                    <option value="NZ">Nova Zelândia</option>
                                    <option value="IE">Irlanda</option>
                                    <option value="CH">Suíça</option>
                                    <option value="BE">Bélgica</option>
                                    <option value="AT">Áustria</option>
                                    <option value="PL">Polônia</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label>Rua</Label>
                                    <Input
                                        placeholder="Rua das Flores"
                                        value={form.street}
                                        onChange={(e) => handleChange('street', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Número</Label>
                                    <Input
                                        placeholder="120"
                                        value={form.number}
                                        onChange={(e) => handleChange('number', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Bairro</Label>
                                    <Input
                                        placeholder="Centro"
                                        value={form.district}
                                        onChange={(e) => handleChange('district', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Cidade</Label>
                                    <Input
                                        placeholder="Santo André"
                                        value={form.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Estado</Label>
                                    <Input
                                        placeholder="SP"
                                        value={form.state}
                                        onChange={(e) => handleChange('state', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>CEP</Label>
                                    <Input
                                        placeholder="09010-000"
                                        value={form.zip_code}
                                        onChange={(e) => handleChange('zip_code', e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* --- PROFISSIONAIS --- */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 text-sm font-semibold">
                                <Building2 className="h-4 w-4" />
                                <span>Informações Profissionais</span>
                                <div className="h-px flex-1 bg-border/50" />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <DollarSign className="h-3.5 w-3.5" /> Salário
                                    </Label>
                                    <Input
                                        placeholder="R$ 3.500,00"
                                        value={form.salary}
                                        onChange={(e) => handleChange('salary', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Código da Loja *</Label>
                                    <Select
                                        value={form.store_code}
                                        onValueChange={(value) => handleChange('store_code', value)}
                                        disabled={loadingStores || loading}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={loadingStores ? 'Carregando...' : 'Selecione uma loja'} />
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
                                        onChange={(e) => handleChange('department', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Função</Label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={form.role}
                                        onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
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
                                                    id={`benefit-${benefit}`}
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
                                                    htmlFor={`benefit-${benefit}`}
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
                                            onChange={(e) => handleChange('benefits', e.target.value)}
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
                                        onChange={(e) => handleChange('emergency_name', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Telefone</Label>
                                    <Input
                                        placeholder="(11) 99876-5432"
                                        value={form.emergency_phone}
                                        onChange={(e) => handleChange('emergency_phone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="p-3 border-t bg-muted/30 backdrop-blur-sm flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancelar
                    </Button>

                    <Button onClick={handleSubmit} disabled={loading} className="px-8">
                        {loading ? 'Criando...' : 'Criar Funcionário'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
