"use client";

import * as React from "react";
import { Package, TrendingUp, AlertCircle, Container } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";


export function InventoryTotal() {
  return (
    <Card className="flex flex-col h-full w-full">
      <CardContent className="flex items-center justify-between w-full">

        <div className="flex flex-col text-left">
           <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Container className="w-5 h-5 text-primary" />
            Estoque Total
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Monitoramento em tempo real
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
