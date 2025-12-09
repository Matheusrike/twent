import { InputEmail } from '../contactForm/input-email';
import { InputName } from '../contactForm/input-name';
import { InputPhone } from '../contactForm/input-phone';
import { Textarea } from '../contactForm/textarea';
import { Button } from '@/components/web/Global/ui/button';
import React, { useState } from 'react';

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

const ContactForm: React.FC<ContactFormProps> = ({ onBack, store }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            store_id: store?.id,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            appointment_date: new Date(appointmentDate).toISOString(),
            notes,
        };

        const res = await fetch('/response/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.error('Erro ao enviar');
            return;
        }

        console.log('Enviado!');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <button onClick={onBack} className="text-sm text-primary text-left">
                Voltar
            </button>

            <h2 className="text-xl font-semibold dark:text-white">{store?.name ?? 'Boutique Exemplo'}</h2>

            {store?.country && <p className="text-sm text-muted-foreground dark:text-white">País: {store.country}</p>}

            <InputEmail value={email} onChange={(event) => setEmail(event.target.value)} />
            <InputName value={name} onChange={(event) => setName(event.target.value)} />
            <InputPhone
                value={phone}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhone(event.target.value)}
            />
            <Textarea
                value={notes}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(event.target.value)}
            />

            {/* Data obrigatória pro POST */}
            <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="border p-2 rounded-md dark:text-black"
            />

            <section className="flex w-full justify-center gap-2 p-2">
                <Button variant="standartButton" size="standartButton" type="submit" className="w-1/2!">
                    Enviar
                </Button>

                <Button
                    variant="standartButton"
                    size="standartButton"
                    type="button"
                    onClick={onBack}
                    className="w-1/2! bg-muted-foreground! hover:bg-gray-400!"
                >
                    Cancelar
                </Button>
            </section>
        </form>
    );
};

export default ContactForm;
