import Link from "next/link";
import contactData from "./json/contactData.json";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
};

const ContactHero = () => {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-evenly pt-20 pb-20"
      style={{
        backgroundImage: `url("/img/contact/banner.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
    
      <div className="absolute inset-0 bg-black/50"></div>

      {/* text content */}
      <div className="relative z-10 text-center max-w-4xl px-4 md:px-0 text-white">
        <span className="uppercase font-semibold text-base md:text-lg text-gray-200">
          Fale Conosco
        </span>
        <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Nossa equipe está sempre disponível para ajudar
        </h2>
        <p className="mt-6 text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-200">
          Estamos prontos para responder às suas dúvidas e oferecer suporte quando você precisar.
        </p>
      </div>

      {/* contact content */}
      <div className="relative z-10 mt-16 w-full max-w-[1280px] px-6 xl:px-0 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contactData.map(({ type, description, value, link, icon }) => {
          const Icon = iconMap[icon];
          return (
            <div
              key={type}
              className="flex flex-col items-center text-center border border-gray-200 dark:border-none rounded-xl p-6 shadow-sm hover:shadow-lg transform hover:scale-105 transition duration-300 bg-white dark:bg-background"
            >
              <div className="h-12 w-12 flex items-center justify-center bg-primary text-white rounded-full">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-5 font-semibold text-xl text-black dark:text-white">
                {type}
              </h3>
              <p className="mt-2 text-muted-foreground">{description}</p>
              <Link
                href={link}
                target={type === "Office" ? "_blank" : "_self"}
                className="mt-4 font-medium text-primary dark:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                {value}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContactHero;
