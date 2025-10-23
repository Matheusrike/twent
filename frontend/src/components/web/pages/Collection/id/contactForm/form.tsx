import { InputEmail } from "../contactForm/input-email";
import { InputName } from "../contactForm/input-name";
import { InputPhone } from "../contactForm/input-phone";
import { Textarea } from "../contactForm/textarea";
import { Button } from "@/components/web/Global/ui/button";

interface ContactFormProps {
    onBack?: () => void;
}

export default function ContactForm({ onBack }: ContactFormProps) {
    const handleCancel = () => {
        if (onBack) {
            onBack(); // Volta para o card da boutique
        }
    };

    return (
        <form className="w-full flex flex-col gap-8.5 h-full z-50 justify-center items-center ">
            <div className="w-full flex gap-2 text-left left-4 text-3xl font-semibold leading-tight tracking-tighter dark:text-white">
                <h1>Boutique Exemplo</h1>
                <h2>-</h2>
                <h1>País</h1>
            </div>
            <InputEmail />
            <InputName />
            <InputPhone />
            <Textarea />
            
            <section className="flex w-full justify-center gap-2 p-2">
                <Button
                    variant="standartButton"
                    size="standartButton"
                    type="submit"
                    className="w-1/2!"
                >
                    Enviar
                </Button>
                <Button
                    variant="standartButton"
                    size="standartButton"
                    type="button"
                    onClick={handleCancel}
                    className="w-1/2! bg-muted-foreground! hover:bg-gray-400!"
                >
                    Cancelar
                </Button>
            </section>
        </form>
    );
}