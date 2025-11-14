"use client";

import { useState } from "react";
import { Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// reset password modal
function ResetPasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>
            Altere sua senha com segurança. Certifique-se de que seja forte e
            diferente da anterior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">

          <div className="space-y-2">
            <Label htmlFor="password">Senha Atual</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Senha</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" className="w-full cursor-pointer">
            Redefinir Senha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfileContent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Verifique suas informações. Em caso de erro, contate o suporte.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" defaultValue="Nome" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sobrenome">Sobrenome</Label>
                  <Input id="sobrenome" defaultValue="Sobrenome" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="email@empresa.com"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" defaultValue="Cargo" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" defaultValue="Empresa" disabled />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Senha</Label>
                  <p className="text-muted-foreground text-sm">
                    Última alteração há 3 meses
                  </p>
                </div>
                <Button variant="outline" onClick={() => setOpen(true)}>
                  <Key className="mr-2 h-4 w-4" />
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* modal */}
      <ResetPasswordModal open={open} onOpenChange={setOpen} />
    </>
  );
}
