"use client";

import * as React from "react";
 import { IconGlobe } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";


const branches = [
  { name: "Itaquera", status: "ativa" },
  { name: "Branch 2", status: "inativa" },
  { name: "Branch 3", status: "ativa" },
  { name: "Branch 4", status: "ativa" },
  { name: "Branch 5", status: "inativa" },
];

const activeCount = branches.filter((b) => b.status === "ativa").length;
const inactiveCount = branches.filter((b) => b.status === "inativa").length;

export function BranchesHeader() {
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

  
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
          <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
              Ativas
            </span>
            <span className="text-2xl font-bold text-foreground">
              {activeCount}
            </span>
            <span className="text-xs text-muted-foreground">
              filiais em operação
            </span>
          </div>

          <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
            <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
              Inativas
            </span>
            <span className="text-2xl font-bold text-foreground">
              {inactiveCount}
            </span>
            <span className="text-xs text-muted-foreground">
              filiais desativadas
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
