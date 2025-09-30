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
    <div className="relative z-10 container mx-auto py-16 px-6 flex flex-col items-center w-full">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-8 tracking-tight leading-tight">
            Perguntas <br /> Frequentes
          </h2>
          <p className="text-gray-300 dark:text-white text-lg md:text-xl leading-relaxed font-light max-w-2xl">
            Respostas rápidas para perguntas comuns sobre nossos produtos e serviços.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {faqData.map(({ question, answer, icon }) => {
            const Icon = iconMap[icon];

            return (
              <div
                key={question}
                className="group relative overflow-hidden border border-gray-200/50 dark:border-white/5 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white dark:bg-background"
              >
                {/* Subtle gradient overlay on hover */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  aria-hidden="true"
                />

                <div className="relative">
                  {/* Icon with glow effect */}
                  <div className="flex items-start gap-5 mb-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                      <div className="relative bg-gradient-to-br from-primary to-primary/80 h-14 w-14 flex items-center justify-center rounded-2xl shadow-lg group-hover:shadow-primary/25 transition-all duration-500">
                        {Icon && <Icon  />}
                      </div>
                    </div>

                    <div className="flex-1 pt-1">
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                        {question}
                      </h3>
                    </div>
                  </div>

                  {/* Answer */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                    {answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FaqHero;