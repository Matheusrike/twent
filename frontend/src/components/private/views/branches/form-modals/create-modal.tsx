'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2, Mail, Phone, MapPin, Clock, Globe } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface OpeningHour {
  day: string;
  open: string | null;
  close: string | null;
  closed: boolean;
}

interface CreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const DAYS_PTBR = [
  { value: 'Monday', label: 'Segunda-feira' },
  { value: 'Tuesday', label: 'Terça-feira' },
  { value: 'Wednesday', label: 'Quarta-feira' },
  { value: 'Thursday', label: 'Quinta-feira' },
  { value: 'Friday', label: 'Sexta-feira' },
  { value: 'Saturday', label: 'Sábado' },
  { value: 'Sunday', label: 'Domingo' },
];

const DEFAULT_FORM_STATE = {
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
  country: 'BR',
  opening_hours: DAYS_PTBR.map((d) => ({
    day: d.value,
    open: '09:00' as const,
    close: '18:00' as const,
    closed: false,
  })),
};

export default function CreateModal({ open, onOpenChange, onCreated }: CreateModalProps) {
  const [form, setForm] = React.useState(DEFAULT_FORM_STATE);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setForm(DEFAULT_FORM_STATE);
      setError('');
    }
  }, [open]);

  const handleChange = (key: keyof typeof DEFAULT_FORM_STATE, value: string) => {
    setError('');
    if (key === 'zip_code') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 8) {
        const formatted = cleaned.length > 5 ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}` : cleaned;
        setForm((prev) => ({ ...prev, zip_code: formatted }));
      }
      return;
    }
    if (key === 'number') {
      const cleaned = value.replace(/\D/g, '');
      setForm((prev) => ({ ...prev, number: cleaned }));
      return;
    }
    if (key === 'phone') {
      const country = form.country;
      let raw = value.replace(/[^\d+]/g, '');
      if (raw.startsWith('++')) raw = raw.replace(/^\++/, '+');
      if (raw !== '' && raw[0] !== '+') raw = raw.replace(/\+/g, '');

      const countryRules: Record<string, { prefix: string; groups: number[] }> = {
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
        US: { prefix: '+1', groups: [3, 3, 4] },
        CA: { prefix: '+1', groups: [3, 3, 4] },
        MX: { prefix: '+52', groups: [2, 4, 4] },
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
        JP: { prefix: '+81', groups: [2, 4, 4] },
        CN: { prefix: '+86', groups: [3, 4, 4] },
        KR: { prefix: '+82', groups: [2, 4, 4] },
        SG: { prefix: '+65', groups: [4, 4] },
        IN: { prefix: '+91', groups: [5, 5] },
        AU: { prefix: '+61', groups: [1, 4, 4] },
        NZ: { prefix: '+64', groups: [1, 3, 4] },
        ZA: { prefix: '+27', groups: [2, 3, 4] },
        EG: { prefix: '+20', groups: [2, 3, 4] },
        NG: { prefix: '+234', groups: [3, 3, 4] },
      };

      const rule = countryRules[country];
      if (!rule) {
        setForm((prev) => ({ ...prev, phone: raw }));
        return;
      }

      if (raw.startsWith('+')) {
        const onlyNumbers = raw.replace(/\D/g, '');
        const maxLength = rule.groups.reduce((a, b) => a + b, 0) + 4;
        const sliced = onlyNumbers.slice(0, maxLength);
        setForm((prev) => ({ ...prev, phone: '+' + sliced }));
        return;
      }

      let digits = raw.replace(/\D/g, '');
      const maxDigits = rule.groups.reduce((a, b) => a + b, 0);
      if (digits.length > maxDigits) digits = digits.slice(0, maxDigits);

      const parts: string[] = [];
      let pos = 0;
      for (const size of rule.groups) {
        if (pos >= digits.length) break;
        parts.push(digits.slice(pos, pos + size));
        pos += size;
      }
      setForm((prev) => ({ ...prev, phone: parts.join(' ') }));
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toE164 = (phone: string, country: string) => {
    const digits = phone.replace(/\D/g, '');
    if (phone.startsWith('+')) return '+' + digits;
    const prefixes: Record<string, string> = {
      BR: '+55', US: '+1', CA: '+1', MX: '+52', AR: '+54', CL: '+56',
      CO: '+57', PE: '+51', UY: '+598', PY: '+595', BO: '+591',
      EC: '+593', VE: '+58', PT: '+351', ES: '+34', FR: '+33',
      DE: '+49', IT: '+39', CH: '+41', UK: '+44', NL: '+31',
      BE: '+32', SE: '+46', NO: '+47', DK: '+45', FI: '+358',
      IE: '+353', JP: '+81', CN: '+86', KR: '+82', SG: '+65',
      IN: '+91', AU: '+61', NZ: '+64', ZA: '+27', EG: '+20', NG: '+234',
    };
    return (prefixes[country] || '') + digits;
  };

  const updateOpeningHour = (index: number, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setForm((prev) => {
      const hours = [...prev.opening_hours];

      if (field === 'closed') {
        const closed = value as boolean;
        hours[index] = {
          ...hours[index],
          closed,
          open: closed ? null : hours[index].open ?? '09:00',
          close: closed ? null : hours[index].close ?? '18:00',
        };
      } else {
        const timeValue = value === '' ? null : (value as string);
        hours[index] = {
          ...hours[index],
          [field]: timeValue,
          closed: false,
        };
      }

      return { ...prev, opening_hours: hours };
    });
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email) {
      setError('Por favor, preencha os campos obrigatórios (Nome e Email)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        phone: form.phone ? toE164(form.phone, form.country) : '',
        opening_hours: form.opening_hours.map((h) => ({
          day: h.day,
          open: h.closed ? null : h.open,
          close: h.closed ? null : h.close,
        })),
      };

      const response = await fetch('/response/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Erro ao criar a filial');

      setForm(DEFAULT_FORM_STATE);
      onOpenChange(false);
      onCreated?.();
    } catch (err: any) {
      setError(err.message || 'Falha ao criar filial. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6 space-y-4 border-b bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold tracking-tight">Nova Filial</DialogTitle>
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

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  Nome da Filial <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Filial Centro"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="filial@empresa.com.br"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Ex: 11 98765-4321"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2">
                  País
                </Label>
                <Select value={form.country} onValueChange={(v) => setForm((p) => ({ ...p, country: v, phone: '' }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {[
                      { code: 'BR', name: 'Brasil' },
                      { code: 'US', name: 'Estados Unidos' },
                      { code: 'AR', name: 'Argentina' },
                      { code: 'PT', name: 'Portugal' },
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

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input id="street" placeholder="Av. Paulista" value={form.street} onChange={(e) => handleChange('street', e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" placeholder="1000" value={form.number} onChange={(e) => handleChange('number', e.target.value)} className="h-11" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">Bairro</Label>
                  <Input id="district" placeholder="Bela Vista" value={form.district} onChange={(e) => handleChange('district', e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" placeholder="São Paulo" value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" placeholder="SP" value={form.state} onChange={(e) => handleChange('state', e.target.value)} className="h-11" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input id="zip_code" placeholder="01310-100" value={form.zip_code} onChange={(e) => handleChange('zip_code', e.target.value)} className="h-11" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                <Clock className="h-4 w-4" />
                <span>Horário de Funcionamento</span>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              <div className="space-y-3">
                {form.opening_hours.map((hour, idx) => {
                  const dayLabel = DAYS_PTBR.find((d) => d.value === hour.day)?.label || hour.day;
                  return (
                    <div key={hour.day} className="flex items-center gap-4">
                      <div className="w-40 text-sm font-medium">{dayLabel}</div>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={hour.closed}
                            onCheckedChange={(c) => updateOpeningHour(idx, 'closed', c as boolean)}
                          />
                          <span className="text-sm">Fechado</span>
                        </div>
                        <Input
                          type="time"
                          value={hour.closed ? '' : hour.open || ''}
                          disabled={hour.closed}
                          onChange={(e) => updateOpeningHour(idx, 'open', e.target.value)}
                          className="h-10 w-32"
                        />
                        <span className="text-muted-foreground">às</span>
                        <Input
                          type="time"
                          value={hour.closed ? '' : hour.close || ''}
                          disabled={hour.closed}
                          onChange={(e) => updateOpeningHour(idx, 'close', e.target.value)}
                          className="h-10 w-32"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-muted/30 backdrop-blur-sm flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="px-8">
            {loading ? 'Criando...' : 'Criar Filial'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}