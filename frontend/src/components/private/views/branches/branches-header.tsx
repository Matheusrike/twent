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
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchBranches() {
      try {
        setLoading(true);

        const response = await fetch("/response/api/store", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar dados: ${response.status}`);
        }

        const { data } = await response.json();
        setBranches(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBranches();
  }, []);

  const activeCount = branches.filter((b) => b.is_active).length;
  const inactiveCount = branches.filter((b) => !b.is_active).length;

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
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
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
