import { Button } from '@/components/web/Global/ui/button';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface Store {
    id: string;
    name: string;
    email?: string;
    city?: string;
    country?: string;
}

interface ContactFormProps {
    onBack: () => void;
    store?: Store;
}

// InputEmail Component
function InputEmail({ className, value, onChange, ...props }: React.ComponentProps<'input'>) {
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        if (!email) return setError('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setError(emailRegex.test(email) ? '' : 'Por favor, insira um email válido');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) validateEmail(e.target.value);
        onChange?.(e);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1.5">
                E-mail *
            </label>
            <input
                type="email"
                value={value}
                onChange={handleChange}
                onBlur={(e) => {
                    validateEmail(e.target.value);
                    props.onBlur?.(e);
                }}
                className={cn(
                    'w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-background',
                    error && 'border-destructive',
                    className
                )}
                aria-invalid={!!error}
                {...props}
            />
            {error && <p className="text-destructive text-xs mt-1.5 ml-0.5">{error}</p>}
        </div>
    );
}

// InputName Component
function InputName({ className, value, onChange, ...props }: React.ComponentProps<'input'>) {
    const [error, setError] = useState('');

    const validateName = (name: string) => {
        if (!name) return setError('');
        setError(name.trim().length < 2 ? 'Por favor, insira um nome válido' : '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) validateName(e.target.value);
        onChange?.(e);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1.5">
                Nome *
            </label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onBlur={(e) => {
                    validateName(e.target.value);
                    props.onBlur?.(e);
                }}
                className={cn(
                    'w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-background',
                    error && 'border-destructive',
                    className
                )}
                aria-invalid={!!error}
                {...props}
            />
            {error && <p className="text-destructive text-xs mt-1.5 ml-0.5">{error}</p>}
        </div>
    );
}

// InputPhone Component
function InputPhone({ className, value, onChange, ...props }: React.ComponentProps<'input'>) {
    const [error, setError] = useState('');

    const formatPhone = (val: string) => {
        const numbers = val.replace(/\D/g, '');
        
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, p1, p2, p3) => {
                if (p3) return `(${p1}) ${p2}-${p3}`;
                if (p2) return `(${p1}) ${p2}`;
                if (p1) return `(${p1}`;
                return numbers;
            });
        } else {
            return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, p1, p2, p3) => {
                if (p3) return `(${p1}) ${p2}-${p3}`;
                if (p2) return `(${p1}) ${p2}`;
                return numbers;
            });
        }
    };

    const validatePhone = (phone: string) => {
        if (!phone) {
            setError('');
            return;
        }
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length < 10) {
            setError('Por favor, insira um telefone válido');
        } else {
            setError('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: formatted
            }
        } as React.ChangeEvent<HTMLInputElement>;
        
        if (error) {
            validatePhone(formatted);
        }
        onChange?.(syntheticEvent);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1.5">
                Telefone *
            </label>
            <input
                type="tel"
                value={value}
                maxLength={15}
                onChange={handleChange}
                onBlur={(e) => {
                    validatePhone(e.target.value);
                    props.onBlur?.(e);
                }}
                className={cn(
                    'w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-background',
                    error && 'border-destructive',
                    className
                )}
                aria-invalid={!!error}
                {...props}
            />
            {error && <p className="text-destructive text-xs mt-1.5 ml-0.5">{error}</p>}
        </div>
    );
}

// Textarea Component
function Textarea({ className, value, onChange, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1.5">
                Mensagem (opcional)
            </label>
            <textarea
                value={value}
                onChange={onChange}
                className={cn(
                    'w-full min-h-[120px] max-h-[300px] rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-background resize-y',
                    className
                )}
                {...props}
            />
        </div>
    );
}

// Main Form Component
const ContactForm: React.FC<ContactFormProps> = ({ onBack, store }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validateForm = () => {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setSubmitError('Por favor, insira um email válido');
            return false;
        }

        // Validar nome
        if (!name || name.trim().length < 2) {
            setSubmitError('Por favor, insira um nome válido');
            return false;
        }

        // Validar telefone
        const phoneNumbers = phone.replace(/\D/g, '');
        if (!phone || phoneNumbers.length < 10) {
            setSubmitError('Por favor, insira um telefone válido');
            return false;
        }

        // Validar data
        if (!appointmentDate) {
            setSubmitError('Por favor, selecione uma data e hora para o agendamento');
            return false;
        }

        // Verificar se a data não é no passado
        const selectedDate = new Date(appointmentDate);
        const now = new Date();
        if (selectedDate < now) {
            setSubmitError('Por favor, selecione uma data futura');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess(false);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                store_id: store?.id,
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                appointment_date: new Date(appointmentDate).toISOString(),
                notes,
            };

            const res = await fetch('/response/api/appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                // throw new Error(errorData.message || 'Erro ao enviar agendamento');
            }

            setSubmitSuccess(true);
            
            // Limpar formulário após sucesso
            setEmail('');
            setName('');
            setPhone('');
            setNotes('');
            setAppointmentDate('');
            
            // Mostrar mensagem de sucesso por 3 segundos antes de voltar
            setTimeout(() => {
                onBack();
            }, 3000);

        } catch (error) {
            console.error('Erro ao enviar:', error);
            setSubmitError(error instanceof Error ? error.message : 'Erro ao enviar agendamento. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 h-full overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Botão Voltar */}
                <div className="hidden lg:flex w-full mb-8 justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="flex items-center text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 text-[#DE1A26]" />
                        Voltar à página anterior
                    </Button>
                </div>

                {/* Título da loja */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground">
                        {store?.name ?? 'Boutique Exemplo'}
                    </h2>
                    {store?.country && (
                        <p className="text-sm text-muted-foreground">
                            País: {store.country}
                        </p>
                    )}
                </div>

                {/* Mensagens de erro/sucesso */}
                {submitError && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
                        {submitError}
                    </div>
                )}

                {submitSuccess && (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                        ✓ Agendamento enviado com sucesso! Redirecionando...
                    </div>
                )}

                {/* Campos do formulário */}
                <div className="grid grid-cols-1 gap-5">
                    <InputEmail
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <InputName
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    
                    <InputPhone
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    {/* Data e hora do agendamento */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Data e hora do agendamento *
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-background"
                        />
                    </div>

                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Alguma observação ou mensagem adicional..."
                    />
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        className="w-full sm:w-auto flex-1"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Agendamento'}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={onBack}
                        className="w-full sm:w-auto flex-1"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;