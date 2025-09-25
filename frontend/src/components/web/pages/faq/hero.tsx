import {
  BadgeDollarSign,
  Route,
  ShieldCheck,
  Truck,
  Undo2,
  UserRoundCheck,
} from "lucide-react";

import faqData from './faqData.json';

const iconMap: Record<string, React.ComponentType> = {
  Undo2: Undo2,
  Route: Route,
  Truck: Truck,
  BadgeDollarSign: BadgeDollarSign,
  ShieldCheck: ShieldCheck,
  UserRoundCheck: UserRoundCheck
};

const FaqHero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 container">
      <div className="max-w-[--breakpoint-lg]">
        <h2 className="text-4xl md:text-5xl leading-[1.15]! font-semibold tracking-tighter text-center text-black dark:text-white">
          Perguntas Frequentes
        </h2>
        <p className="mt-3 text-xl text-center text-muted-foreground">
          Respostas rápidas para perguntas comuns sobre nossos produtos e serviços.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {faqData.map(({ question, answer, icon }) => {
            const Icon = iconMap[icon];

            return (
              <div
                key={question}
                className="border border-gray-200 dark:border-none rounded-xl p-6 shadow-sm hover:shadow-lg transform hover:scale-105 transition duration-300 bg-white dark:bg-background"
              >
                <div className="flex items-center justify-start gap-4">
                  <div className="bg-primary flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full text-white">
                    {Icon && <Icon />}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight text-black dark:text-white">
                    {question}
                  </h3>
                </div>

                <p className="mt-4 text-black dark:text-gray-300 leading-relaxed text-sm md:text-base">
                  {answer}
                </p>
              </div>

            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FaqHero;
