import Link from "next/link";
import contactData from "./contactData.json";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
};

const ContactHero = () => (
  <div className="min-h-screen flex items-center justify-center pt-12 md:pt-16 pb-16">
    <div className="w-full max-w-(--breakpoint-xl) mx-auto px-6 xl:px-0">
      {/* título e descrição */}
      <b className="text-muted-foreground uppercase font-semibold text-sm">
        Fale Conosco
      </b>
      <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tighter text-black dark:text-white">
        Nossa equipe está sempre disponível para ajudar
      </h2>
      <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
        Estamos prontos para responder às suas dúvidas e oferecer suporte quando você precisar.
      </p>

      {/* cards */}
      <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contactData.map(({ type, description, value, link, icon }) => {
          const Icon = iconMap[icon];
          return (
            <div
              key={type}
              className="flex flex-col items-center text-center 
              border border-gray-200 dark:border-none 
              rounded-xl p-6 
              shadow-sm hover:shadow-lg 
              transform hover:scale-105 
              transition duration-300 
              bg-white dark:bg-background"
            >
              <div className="h-12 w-12 flex items-center justify-center bg-primary text-white rounded-full">
                <Icon />
              </div>
              <h3 className="mt-5 font-semibold text-xl text-black dark:text-white">
                {type}
              </h3>
              <p className="mt-2 text-muted-foreground">{description}</p>
              <Link
                href={link}
                target={type === "Office" ? "_blank" : "_self"}
                className="mt-4 font-medium text-primary dark:text-white hover:underline"
              >
                {value}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default ContactHero;
