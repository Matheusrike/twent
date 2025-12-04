import { InputEmail } from "../contactForm/input-email";
import { InputName } from "../contactForm/input-name";
import { InputPhone } from "../contactForm/input-phone";
import { Textarea } from "../contactForm/textarea";
import { Button } from "@/components/web/Global/ui/button";
import React from "react";

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
  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="text-sm text-primary text-left">Voltar</button>
      <h2 className="text-xl font-semibold dark:text-white">{store?.name ?? "Boutique Exemplo"}</h2>
      {store?.country && (
        <p className="text-sm text-muted-foreground dark:text-white">País: {store.country}</p>
      )}
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
          onClick={onBack}
          className="w-1/2! bg-muted-foreground! hover:bg-gray-400!"
        >
          Cancelar
        </Button>
      </section>
    </div>
  );
};

export default ContactForm;