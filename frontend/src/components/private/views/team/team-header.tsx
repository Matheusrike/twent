"use client";

import * as React from "react";
import { IconUsers } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
};

export function TeamHeader() {
  const [activeCount, setActiveCount] = React.useState(0);
  const [inactiveCount, setInactiveCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  // Escuta eventos de atualização dos indicadores da tabela
  React.useEffect(() => {
    const handleUpdateIndicators = (event: CustomEvent) => {
      setActiveCount(event.detail.activeCount);
      setInactiveCount(event.detail.inactiveCount);
      setLoading(false);
    };

    // Escuta evento customizado com dados filtrados da tabela
    window.addEventListener('team:update-indicators', handleUpdateIndicators as EventListener);

    // Carrega dados iniciais
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/response/api/employee", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const { data } = await response.json();
          const active = data?.filter((e: Employee) => e.is_active).length || 0;
          const inactive = data?.filter((e: Employee) => !e.is_active).length || 0;
          setActiveCount(active);
          setInactiveCount(inactive);
        }
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      window.removeEventListener('team:update-indicators', handleUpdateIndicators as EventListener);
    };
  }, []);

  return (
    <Card className="flex flex-col h-full w-full">
      <CardContent className="flex items-center justify-between w-full">
        {/* Título */}
        <div className="flex flex-col text-left">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <IconUsers className="w-5 h-5 text-primary" />
            Colaboradores
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Monitoramento de status de colaboradores
          </CardDescription>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-20 w-full" />
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-20 w-full" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">

           
            <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                Ativos
              </span>
              <span className="text-2xl font-bold text-foreground">
                {activeCount}
              </span>
              <span className="text-xs text-muted-foreground">
                colaboradores em operação
              </span>
            </div>

            <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
              <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                Inativos
              </span>
              <span className="text-2xl font-bold text-foreground">
                {inactiveCount}
              </span>
              <span className="text-xs text-muted-foreground">
                colaboradores desativados
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
