"use client";

import * as React from "react";
import { IconGlobe } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type Branch = {
  id: string;
  name: string;
  code: string;
  zip_code: string;
  country: string;
  email: string;
  is_active: boolean;
};

export function BranchesHeader() {
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
    window.addEventListener('branches:update-indicators', handleUpdateIndicators as EventListener);

    // Carrega dados iniciais
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/response/api/store", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const { data } = await response.json();
          const active = data?.filter((b: Branch) => b.is_active).length || 0;
          const inactive = data?.filter((b: Branch) => !b.is_active).length || 0;
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
      window.removeEventListener('branches:update-indicators', handleUpdateIndicators as EventListener);
    };
  }, []);

  return (
    <Card className="flex flex-col h-full w-full">
      <CardContent className="flex items-center justify-between w-full">
        {/* Título */}
        <div className="flex flex-col text-left">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <IconGlobe className="w-5 h-5 text-primary" />
            Filiais
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Monitoramento de status das unidades
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
            {/* Ativas */}
            <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                Ativas
              </span>
              <span className="text-2xl font-bold">{activeCount}</span>
              <span className="text-xs text-muted-foreground">
                filiais em operação
              </span>
            </div>

            {/* Inativas */}
            <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
              <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                Inativas
              </span>
              <span className="text-2xl font-bold">{inactiveCount}</span>
              <span className="text-xs text-muted-foreground">
                filiais desativadas
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
