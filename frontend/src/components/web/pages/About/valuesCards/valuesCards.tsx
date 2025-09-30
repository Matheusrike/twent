import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Image from "next/image";

import {
  HeartHandshake,
  Lightbulb,
  Users,
  ShieldCheck,
  Leaf,
  Target,
} from "lucide-react";

import features from "./valuesCardsData.json";

// Mapeamento dos nomes dos ícones para os componentes
const iconMap: any = {
  HeartHandshake,
  Lightbulb,
  Users,
  ShieldCheck,
  Leaf,
  Target,
};

const valuesCards = () => {
  return (
    <div className="flex container">
      <div className="w-full py-20 px-6 flex-col ">
        <h2 className="text-5xl md:text-6xl lg:text-6xl font-semibold text-primary mb-8 tracking-tight dark:text-white">
          Nossos Valores
        </h2>

        <div className="mt-6 md:mt-10 w-full mx-auto grid md:grid-cols-2 gap-12">
          <div className="h-[430px] overflow-y-auto">
            <Accordion defaultValue="item-0" type="single" className="w-full h-full">
              {features.map(({ title, description, icon }, index) => {
                const IconComponent = iconMap[icon];
                return (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="group/accordion-item data-[state=open]:border-b-2 data-[state=open]:border-primary dark:border-gray-700"
                  >
                    <AccordionTrigger className="text-lg [&>svg]:hidden group-first/accordion-item:pt-0">
                      <div className="flex items-center gap-4 dark:text-white">
                        {IconComponent && <IconComponent size={24} />}
                        {title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-[17px] leading-relaxed text-muted-foreground dark:text-gray-200">
                      {description}
                      <div className="mt-6 mb-2 md:hidden aspect-video w-full bg-muted rounded-xl" />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Media */}
          <div className="relative overflow-hidden w-full md:basis-7/12 lg:basis-1/2 
                aspect-[4/2] bg-muted rounded-xl border border-border/50 shadow-m">
            <img
              src="/img/about/aboutImgValue.png"
              width={"auto"}
              height={"auto"}
              alt="Descrição da imagem"
              className="object-cover rounded-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default valuesCards;