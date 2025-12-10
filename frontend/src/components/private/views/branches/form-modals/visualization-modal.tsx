'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2, Mail, Phone, MapPin, Clock, Globe, Power, PowerOff } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
    is_active?: boolean;
}

interface VisualizationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    storeId?: string;
}

const DEFAULT_FORM_STATE: StoreFormData = {
    name: '',
    code: '',
    type: 'BRANCH',
    email: '',
    phone: '',
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    latitude: '',
    longitude: '',
    opening_hours: [{ day: '', open: '', close: '' }],
    is_active: true,
};

export default function VisualizationModal({ open, onOpenChange, onSuccess, storeId }: VisualizationModalProps) {
    const [form, setForm] = React.useState<StoreFormData>(DEFAULT_FORM_STATE);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [initialLoading, setInitialLoading] = React.useState(false);
    const [toggleLoading, setToggleLoading] = React.useState(false);

    const isEditing = !!storeId;
    const modalTitle = isEditing ? 'Editar Filial' : 'Nova Filial';
    const submitButtonText = isEditing ? 'Salvar Alterações' : 'Criar Filial';
    const submitMethod = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `/response/api/store/${storeId}` : '/response/api/store';

    React.useEffect(() => {
        if (open && storeId) {
            const fetchStoreData = async () => {
                setInitialLoading(true);
                setError('');
                try {
                    const response = await fetch(`/response/api/store/${storeId}`, {
                        credentials: 'include',
                    });

                    console.log('ID RECEBIDO NO MODAL:', storeId);
                    if (!response.ok) {
                        throw new Error('Falha ao carregar dados da filial.');
                    }
                    const json = await response.json();
                    const data = json?.data ?? json;

                    setForm({
                        name: data.name ?? '',
                        code: data.code ?? '',
                        type: data.type ?? 'BRANCH',
                        email: data.email ?? '',
                        phone: data.phone ?? '',
                        street: data.street ?? '',
                        number: data.number ?? '',
                        district: data.district ?? '',
                        city: data.city ?? '',
                        state: data.state ?? '',
                        zip_code: data.zip_code ?? '',
                        country: data.country ?? 'BR',
                        latitude: data.latitude === null || data.latitude === undefined ? '' : String(data.latitude),
                        longitude:
                            data.longitude === null || data.longitude === undefined ? '' : String(data.longitude),
                        opening_hours:
                            Array.isArray(data.opening_hours) && data.opening_hours.length > 0
                                ? data.opening_hours.map((h: any) => ({
                                      day: h.day ?? '',
                                      open: h.open ?? '',
                                      close: h.close ?? '',
                                  }))
                                : DEFAULT_FORM_STATE.opening_hours,
                        is_active: data.is_active ?? true,
                    });
                } catch (err: any) {
                    setError(err?.message ?? 'Não foi possível carregar os dados.');
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
        setError('');

        if (key === 'zip_code') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 8) {
                const formatted = cleaned.length > 5 ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}` : cleaned;
                setForm((prev) => ({ ...prev, [key]: formatted }));
            }
            return;
        }

        if (key === 'number') {
            const cleaned = value.replace(/\D/g, '');
            setForm((prev) => ({ ...prev, [key]: cleaned }));
            return;
        }
        if (key === 'phone') {
            const country = form.country;

            // Remove tudo que não é número ou +
            let raw = value.replace(/[^\d+]/g, '');

            // Evita ++ e + fora do começo
            if (raw.startsWith('++')) raw = raw.replace(/^\++/, '+');
            if (raw !== '' && raw[0] !== '+') raw = raw.replace(/\+/g, '');

            // Regras reais de cada país
            const countryRules: Record<string, { prefix: string; groups: number[] }> = {
                // América do Sul
                BR: { prefix: '+55', groups: [2, 5, 4] },
                AR: { prefix: '+54', groups: [2, 4, 4] },
                CL: { prefix: '+56', groups: [1, 4, 4] },
                CO: { prefix: '+57', groups: [3, 3, 4] },
                PE: { prefix: '+51', groups: [2, 3, 4] },
                UY: { prefix: '+598', groups: [1, 3, 4] },
                PY: { prefix: '+595', groups: [2, 3, 4] },
                BO: { prefix: '+591', groups: [1, 3, 4] },
                EC: { prefix: '+593', groups: [2, 3, 4] },
                VE: { prefix: '+58', groups: [3, 3, 4] },

                // América do Norte
                US: { prefix: '+1', groups: [3, 3, 4] },
                CA: { prefix: '+1', groups: [3, 3, 4] },
                MX: { prefix: '+52', groups: [2, 4, 4] },

                // Europa
                PT: { prefix: '+351', groups: [3, 3, 3] },
                ES: { prefix: '+34', groups: [3, 3, 3] },
                FR: { prefix: '+33', groups: [1, 2, 2, 2, 2] },
                DE: { prefix: '+49', groups: [3, 3, 4] },
                IT: { prefix: '+39', groups: [3, 3, 4] },
                CH: { prefix: '+41', groups: [2, 3, 2, 2] },
                UK: { prefix: '+44', groups: [4, 3, 4] },
                NL: { prefix: '+31', groups: [2, 3, 4] },
                BE: { prefix: '+32', groups: [2, 3, 4] },
                SE: { prefix: '+46', groups: [2, 3, 4] },
                NO: { prefix: '+47', groups: [2, 3, 3] },
                DK: { prefix: '+45', groups: [2, 2, 2, 2] },
                FI: { prefix: '+358', groups: [2, 3, 4] },
                IE: { prefix: '+353', groups: [2, 3, 4] },

                // Ásia
                JP: { prefix: '+81', groups: [2, 4, 4] },
                CN: { prefix: '+86', groups: [3, 4, 4] },
                KR: { prefix: '+82', groups: [2, 4, 4] },
                SG: { prefix: '+65', groups: [4, 4] },
                IN: { prefix: '+91', groups: [5, 5] },

                // Oceania
                AU: { prefix: '+61', groups: [1, 4, 4] },
                NZ: { prefix: '+64', groups: [1, 3, 4] },

                // África
                ZA: { prefix: '+27', groups: [2, 3, 4] },
                EG: { prefix: '+20', groups: [2, 3, 4] },
                NG: { prefix: '+234', groups: [3, 3, 4] },
            };

            const rule = countryRules[country];

            // País não mapeado → formato internacional básico
            if (!rule) {
                setForm((prev) => ({ ...prev, [key]: raw }));
                return;
            }

            // Trata número internacional começando com +
            if (raw.startsWith('+')) {
                const onlyNumbers = raw.replace(/\D/g, '');
                const maxLength = rule.groups.reduce((a, b) => a + b, 0) + 4;

                const sliced = onlyNumbers.slice(0, maxLength);

                const formatted = '+' + sliced;

                setForm((prev) => ({ ...prev, [key]: formatted }));
                return;
            }

            // Formatação nacional automática
            let digits = raw.replace(/\D/g, '');

            const groupSizes = rule.groups;
            const maxDigits = groupSizes.reduce((a, b) => a + b, 0);

            if (digits.length > maxDigits) digits = digits.slice(0, maxDigits);

            const parts: string[] = [];
            let cursor = 0;

            for (const size of groupSizes) {
                if (cursor >= digits.length) break;
                const chunk = digits.slice(cursor, cursor + size);
                parts.push(chunk);
                cursor += size;
            }

            const formatted = parts.join(' ');

            setForm((prev) => ({ ...prev, [key]: formatted }));
            return;
        }

        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const toE164 = (phone: string, country: string) => {
        const digits = phone.replace(/\D/g, '');

        // Se já vier com +, só limpa espaços
        if (phone.startsWith('+')) {
            return '+' + digits;
        }

        // Regras de prefixo iguais às usadas na formatação
        const prefixes: Record<string, string> = {
            BR: '+55',
            US: '+1',
            CA: '+1',
            MX: '+52',
            AR: '+54',
            CL: '+56',
            CO: '+57',
            PE: '+51',
            UY: '+598',
            PY: '+595',
            BO: '+591',
            EC: '+593',
            VE: '+58',
            PT: '+351',
            ES: '+34',
            FR: '+33',
            DE: '+49',
            IT: '+39',
            CH: '+41',
            UK: '+44',
            NL: '+31',
            BE: '+32',
            SE: '+46',
            NO: '+47',
            DK: '+45',
            FI: '+358',
            IE: '+353',
            JP: '+81',
            CN: '+86',
            KR: '+82',
            SG: '+65',
            IN: '+91',
            AU: '+61',
            NZ: '+64',
            ZA: '+27',
            EG: '+20',
            NG: '+234',
        };

        const prefix = prefixes[country] || '';
        return prefix + digits;
    };


    const handleOpeningHoursChange = (index: number, field: 'open' | 'close', value: string) => {
        const updated = [...form.opening_hours];
        if (!updated[index]) updated[index] = { day: '', open: '', close: '' };
        updated[index] = { ...updated[index], [field]: value };
        setForm((prev) => ({ ...prev, opening_hours: updated }));
    };

    const handleToggleActive = async () => {
        if (!storeId) return;

        setToggleLoading(true);
        setError('');

        try {
            const action = form.is_active ? 'deactivate' : 'activate';
            const response = await fetch(`/response/api/store/${storeId}/${action}`, {
                method: 'PATCH',
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(
                    (data && (data.message || data.error)) ||
                        `Erro ao ${action === 'activate' ? 'ativar' : 'desativar'} filial`
                );
            }

            setForm((prev) => ({ ...prev, is_active: !prev.is_active }));

            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err?.message ?? 'Erro ao alterar status da filial');
        } finally {
            setToggleLoading(false);
        }
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            const lat = form.latitude !== '' ? Number(form.latitude) : null;
            const lon = form.longitude !== '' ? Number(form.longitude) : null;

            const payload: any = {
                ...form,
                latitude: lat,
                longitude: lon,
                phone: toE164(form.phone, form.country), // ← AQUI o backend para de reclamar
            };


            const response = await fetch(endpoint, {
                method: submitMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error((data && (data.message || data.error)) || 'Erro ao salvar');
            }

            if (!isEditing) setForm(DEFAULT_FORM_STATE);

            onOpenChange(false);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err?.message ?? 'Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden p-0 gap-0 ">
                <DialogHeader className="px-8 pt-8 pb-6 space-y-4 border-b bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-bold tracking-tight">{modalTitle}</DialogTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isEditing
                                        ? 'Edite as informações da unidade'
                                        : 'Cadastre uma nova unidade da sua empresa'}
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
                                            <Label
                                                htmlFor="code"
                                                className="text-sm font-medium flex items-center gap-2"
                                            >
                                                Código
                                            </Label>
                                            <Input
                                                id="code"
                                                placeholder="FILIAL-01"
                                                value={form.code}
                                                onChange={(e) => handleChange('code', e.target.value)}
                                                className="h-11 transition-all hover:border-primary/50"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label
                                                htmlFor="name"
                                                className="text-sm font-medium flex items-center gap-2"
                                            >
                                                Nome da Filial
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Filial Centro"
                                                value={form.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                className="h-11 transition-all hover:border-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-sm font-medium flex items-center gap-2"
                                            >
                                                <Mail className="h-3.5 w-3.5" />
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="filial@empresa.com.br"
                                                value={form.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                className="h-11 transition-all hover:border-primary/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="phone"
                                                className="text-sm font-medium flex items-center gap-2"
                                            >
                                                <Phone className="h-3.5 w-3.5" />
                                                Telefone
                                            </Label>
                                            <Input
                                                id="phone"
                                                placeholder="Ex: +55 11 98765-4321 ou 11 98765-4321"
                                                value={form.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                className="h-11 transition-all hover:border-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="country"
                                            className="text-sm font-medium flex items-center gap-2"
                                        >
                                            <Globe className="h-3.5 w-3.5" />
                                            País
                                        </Label>

                                        <Select
                                            value={form.country}
                                            onValueChange={(value) => {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    country: value,
                                                    phone: '', // limpa e força reformatar
                                                }));
                                            }}
                                        >
                                            <SelectTrigger className="h-11 transition-all hover:border-primary/50">
                                                <SelectValue placeholder="Selecione o país" />
                                            </SelectTrigger>

                                            <SelectContent className="max-h-72">
                                                {[
                                                    { code: 'BR', name: 'Brasil' },
                                                    { code: 'US', name: 'Estados Unidos' },
                                                    { code: 'CA', name: 'Canadá' },
                                                    { code: 'MX', name: 'México' },
                                                    { code: 'AR', name: 'Argentina' },
                                                    { code: 'CL', name: 'Chile' },
                                                    { code: 'CO', name: 'Colômbia' },
                                                    { code: 'PE', name: 'Peru' },
                                                    { code: 'UY', name: 'Uruguai' },
                                                    { code: 'PY', name: 'Paraguai' },
                                                    { code: 'BO', name: 'Bolívia' },
                                                    { code: 'EC', name: 'Equador' },
                                                    { code: 'VE', name: 'Venezuela' },

                                                    { code: 'PT', name: 'Portugal' },
                                                    { code: 'ES', name: 'Espanha' },
                                                    { code: 'FR', name: 'França' },
                                                    { code: 'DE', name: 'Alemanha' },
                                                    { code: 'IT', name: 'Itália' },
                                                    { code: 'CH', name: 'Suíça' },
                                                    { code: 'UK', name: 'Reino Unido' },
                                                    { code: 'NL', name: 'Países Baixos' },
                                                    { code: 'BE', name: 'Bélgica' },
                                                    { code: 'SE', name: 'Suécia' },
                                                    { code: 'NO', name: 'Noruega' },
                                                    { code: 'DK', name: 'Dinamarca' },
                                                    { code: 'FI', name: 'Finlândia' },
                                                    { code: 'IE', name: 'Irlanda' },

                                                    { code: 'JP', name: 'Japão' },
                                                    { code: 'CN', name: 'China' },
                                                    { code: 'KR', name: 'Coreia do Sul' },
                                                    { code: 'SG', name: 'Singapura' },
                                                    { code: 'IN', name: 'Índia' },

                                                    { code: 'AU', name: 'Austrália' },
                                                    { code: 'NZ', name: 'Nova Zelândia' },

                                                    { code: 'ZA', name: 'África do Sul' },
                                                    { code: 'EG', name: 'Egito' },
                                                    { code: 'NG', name: 'Nigéria' },
                                                ].map((c) => (
                                                    <SelectItem key={c.code} value={c.code}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                                <Label htmlFor="street" className="text-sm font-medium">
                                                    Rua
                                                </Label>
                                                <Input
                                                    id="street"
                                                    placeholder="Av. Paulista"
                                                    value={form.street}
                                                    onChange={(e) => handleChange('street', e.target.value)}
                                                    className="h-11 transition-all hover:border-primary/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="number" className="text-sm font-medium">
                                                    Número
                                                </Label>
                                                <Input
                                                    id="number"
                                                    placeholder="1000"
                                                    value={form.number}
                                                    onChange={(e) => handleChange('number', e.target.value)}
                                                    className="h-11 transition-all hover:border-primary/50"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="district" className="text-sm font-medium">
                                                    Bairro
                                                </Label>
                                                <Input
                                                    id="district"
                                                    placeholder="Bela Vista"
                                                    value={form.district}
                                                    onChange={(e) => handleChange('district', e.target.value)}
                                                    className="h-11 transition-all hover:border-primary/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="text-sm font-medium">
                                                    Cidade
                                                </Label>
                                                <Input
                                                    id="city"
                                                    placeholder="São Paulo"
                                                    value={form.city}
                                                    onChange={(e) => handleChange('city', e.target.value)}
                                                    className="h-11 transition-all hover:border-primary/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state" className="text-sm font-medium">
                                                    Estado
                                                </Label>
                                                <Input
                                                    id="state"
                                                    placeholder="SP"
                                                    value={form.state}
                                                    onChange={(e) => handleChange('state', e.target.value)}
                                                    className="h-11 transition-all hover:border-primary/50"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="zip_code" className="text-sm font-medium">
                                                    CEP
                                                </Label>
                                                <Input
                                                    id="zip_code"
                                                    placeholder="01310-100"
                                                    value={form.zip_code}
                                                    onChange={(e) => handleChange('zip_code', e.target.value)}
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
                                                        onChange={(e) =>
                                                            handleOpeningHoursChange(idx, 'open', e.target.value)
                                                        }
                                                        className="h-11 transition-all hover:border-primary/50"
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <Label className="text-sm font-medium">Fechamento</Label>
                                                    <Input
                                                        type="time"
                                                        value={h.close}
                                                        onChange={(e) =>
                                                            handleOpeningHoursChange(idx, 'close', e.target.value)
                                                        }
                                                        className="h-11 transition-all hover:border-primary/50"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="p-2 border-t bg-muted/30 backdrop-blur-sm flex justify-between gap-3">
                    <div>
                        {isEditing && (
                            <Button
                                variant={form.is_active ? 'destructive' : 'default'}
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
                                    {isEditing ? 'Salvando...' : 'Criando...'}
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
