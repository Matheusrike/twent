"use client";

import { useState, useEffect, use } from "react";
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

function ResetPasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1️⃣ Verificar campos
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Preencha todos os campos!");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("A nova senha e a confirmação não coincidem!");
        return;
      }

      // 2️⃣ Buscar ID do usuário logado
      const resUserId = await fetch("/response/api/user/me", {
        method: "GET",
        credentials: "include",
      });

      if (!resUserId.ok) {
        alert("Erro ao identificar usuário.");
        return;
      }

      const userData = await resUserId.json();
      const employeeId = userData.data.id;

      // 3️⃣ Verificar senha atual no backend
      const verifyRes = await fetch("/response/api/auth/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: currentPassword }),
      });

      if (!verifyRes.ok) {
        alert("Senha atual incorreta!");
        return;
      }

      // 4️⃣ Atualizar senha
      const updateRes = await fetch(`/response/api/employee/${employeeId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      if (!updateRes.ok) {
        const err = await updateRes.json();
        alert(err.message || "Erro ao atualizar a senha");
        return;
      }

      alert("Senha atualizada com sucesso!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao se comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

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
            <Label>Senha Atual</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Nova Senha</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Confirmar Nova Senha</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full cursor-pointer"
          >
            {loading ? "Carregando..." : "Redefinir Senha"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function ProfileContent() {
  const [open, setOpen] = useState(false);
  // get profile data
  const [user, setUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    updated_at: "",
    store: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/response/api/user/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) return;

        const { data } = await res.json();
        const updatedAt = new Date(data.updated_at);
        const formattedDate =
          updatedAt.getDate().toString().padStart(2, "0") +
          "/" +
          (updatedAt.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          updatedAt.getFullYear();
        setUser({
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          role: data.user_roles?.[0]?.role?.name || null,
          updated_at: formattedDate,
          store: data.store?.name || null,
        });
      } catch (err) {
        console.error("Erro ao buscar dados do usuário", err);
      }
    };
    fetchUser();
  }, []);

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
                  <Input id="nome" defaultValue={user.first_name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sobrenome">Sobrenome</Label>
                  <Input
                    id="sobrenome"
                    defaultValue={user.last_name}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" defaultValue={user.role} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" defaultValue={user.store} disabled />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Senha</Label>
                  <p className="text-muted-foreground text-sm">
                    Última alteração {user.updated_at}
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
