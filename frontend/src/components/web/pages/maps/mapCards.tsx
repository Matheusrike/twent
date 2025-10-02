import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";
import React from "react";

const TestimonialCard = () => {
  const boutiques = [
    {
      name: "Boutique São Paulo",
      address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
      phone: "+55 (11) 3456-7890",
      hours: {
        weekdays: "Segunda a Sexta: 10h - 20h",
        saturday: "Sábado: 10h - 18h",
        sunday: "Domingo: Fechado",
      },
    },
    {
      name: "Boutique Rio de Janeiro",
      address: "Shopping Leblon, Loja 234 - Leblon, Rio de Janeiro - RJ",
      phone: "+55 (21) 2345-6789",
      hours: {
        weekdays: "Segunda a Sexta: 10h - 22h",
        saturday: "Sábado: 10h - 22h",
        sunday: "Domingo: 14h - 20h",
      },
    },
    {
      name: "Boutique Brasília",
      address: "Brasília Shopping, Piso 2 - Asa Norte, Brasília - DF",
      phone: "+55 (61) 3234-5678",
      hours: {
        weekdays: "Segunda a Sexta: 10h - 22h",
        saturday: "Sábado: 10h - 22h",
        sunday: "Domingo: 12h - 20h",
      },
    },
    
    
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 flex-col overflow-y-scroll h-full">
      {boutiques.map((boutique, i) => (
        <Card
          key={i}
          className="bg-gray-100 dark:bg-zinc-950 relative w-full h-full max-w-sm shadow-none gap-0 pt-0 border-none hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <CardHeader className="py-5">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-semibold text-foreground dark:text-gray-100 text-3xl">
                  {boutique.name}
                </h3>
                <div className="flex items-start gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-muted-foreground dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {boutique.address}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
              <a 
                href={`tel:${boutique.phone.replace(/\D/g, '')}`}
                className="text-[15px] text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 transition-colors"
              >
                {boutique.phone}
              </a>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-muted-foreground dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-[15px] text-muted-foreground dark:text-gray-400 space-y-1">
                <p>{boutique.hours.weekdays}</p>
                <p>{boutique.hours.saturday}</p>
                <p>{boutique.hours.sunday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
};

export default TestimonialCard;