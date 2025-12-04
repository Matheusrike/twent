import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ArrowRight, Shapes, MapPin, Phone, Mail } from "lucide-react";
import React from "react";

interface Store {
  id: string;
  name: string;
  email?: string;
  city?: string;
  country?: string;
  phone?: string;
}

interface StoreCardProps {
  onClick?: () => void;
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ onClick, store }) => {
  return (
    <button
      className="cursor-pointer w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-2xl"
      onClick={onClick}
      aria-label={`Selecionar ${store.name}`}
    >
      <Card className="group flex w-full gap-0 pt-0 bg-white dark:bg-background border border-gray-200/60 dark:border-white/10 hover:border-primary/60 dark:hover:border-primary/60 transition-all duration-300 overflow-hidden rounded-2xl shadow-sm hover:shadow-xl">
        <CardHeader className="py-4 px-5 flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Shapes className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold tracking-tight dark:text-white">{store.name}</h3>
              <p className="text-xs text-muted-foreground">
                {(store.city ?? "") + (store.city && store.country ? ", " : "") + (store.country ?? "")}
              </p>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
        </CardHeader>

        <CardContent className="text-muted-foreground flex flex-wrap items-center gap-2 px-5 pb-5">
          {(store.city || store.country) && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-white/10 bg-muted/40 dark:bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {(store.city ?? "") + (store.city && store.country ? ", " : "") + (store.country ?? "")}
            </span>
          )}

          {store.phone && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-white/10 bg-muted/40 dark:bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {store.phone}
            </span>
          )}

          {store.email && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-white/10 bg-muted/40 dark:bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {store.email}
            </span>
          )}
        </CardContent>
      </Card>
    </button>
  );
};

export default StoreCard;