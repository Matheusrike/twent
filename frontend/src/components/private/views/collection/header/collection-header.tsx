"use client";

import * as React from "react";
import { IconDeviceWatch,IconClockPlus  } from "@tabler/icons-react";
import { } from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";


export function CollectionHeader() {
  return (
    <Card className="flex flex-col h-full w-full">
      <CardContent className="flex items-center justify-between w-full">

        <div className="flex flex-col text-left">
           <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <IconClockPlus  className="w-5 h-5 text-primary" />
            Adicione uma nova coleção
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Monitoramento em tempo real
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
