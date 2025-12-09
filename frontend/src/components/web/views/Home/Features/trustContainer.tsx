'use client'
import React from 'react';
import { Shield, Truck, Award, Headphones, Clock, Gem, Star } from 'lucide-react';

const TrustSection = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const benefits = [
    { icon: <Shield className="w-8 h-8" />, title: "Autenticidade Suíça", description: "Certificado COSC e registro individual no arquivo da manufatura" },
    { icon: <Gem className="w-8 h-8" />, title: "Heritage Collection", description: "Acesso prioritário às edições limitadas e complicações raras" },
    { icon: <Award className="w-8 h-8" />, title: "Garantia Vitalícia", description: "Serviço e manutenção gratuitos por toda a vida da peça" },
    { icon: <Headphones className="w-8 h-8" />, title: "Concierge Privado", description: "Atendimento VIP 24/7 com consultor pessoal dedicado" },
    { icon: <Truck className="w-8 h-8" />, title: "Serviço em Genebra", description: "Revisões e restaurações realizadas exclusivamente na Suíça" },
    { icon: <Star className="w-8 h-8" />, title: "Clube Exclusivo", description: "Convites para eventos privados e experiências na manufatura" }
  ];

  return (
    <section className="py-24 px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
           <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                <span className="w-8 h-0.5 bg-primary"></span>
                Porque Nos Escolher
                 <span className="w-8 h-0.5 bg-primary"></span>
              </div>
          <h2 className="text-5xl font-bold text-primary mb-6 tracking-tight">
            Sua Confiança, Nossa Prioridade
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Compromisso com excelência e satisfação em cada detalhe
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`group relative bg-background rounded-2xl p-8 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-background ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Icon Circle */}
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                {benefit.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-200 leading-relaxed">
                {benefit.description}
              </p>

              {/* Hover Effect Line */}
              {/* <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 rounded-full"></div> */}
            </div>
          ))}
        </div>

   
    
      </div>
    </section>
  );
};

export default TrustSection;