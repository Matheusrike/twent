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
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);

        const response = await fetch("/response/api/employee", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar dados: ${response.status}`);
        }

        const { data } = await response.json();
        setEmployees(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const activeCount = employees.filter((e) => e.is_active).length;
  const inactiveCount = employees.filter((e) => !e.is_active).length;

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
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
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
