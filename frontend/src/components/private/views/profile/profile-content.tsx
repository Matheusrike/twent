"use client";

import { useState, useEffect } from "react";
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
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!password || !newPassword) {
        alert("Preencha todos os campos!");
        return;
      }

      const resUserId = await fetch("/response/api/user/me", {
        method: "GET",
        credentials: "include",
      });

      if (!resUserId.ok) {
        alert("Erro ao identificar usuário.");
        return;
      }

      const updateRes = await fetch(`/response/api/auth/change-password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          newPassword,
        }),
      });

      const resJson = await updateRes.json();

      if (!updateRes.ok) {
        setMessageType("error");
        setMessage(resJson.message || "Erro ao atualizar a senha");
        return;
      }

      setMessageType("success");
      setMessage(resJson.message || "Senha atualizada com sucesso!");

      setPassword("");
      setNewPassword("");

      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch {
      setMessageType("error");
      setMessage("Erro ao se comunicar com o servidor.");
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {message && (
            <div
              className={`px-3 py-2 rounded-md text-sm mt-2 ${
                messageType === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {message}
            </div>
          )}
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
      } catch {}
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

      <ResetPasswordModal open={open} onOpenChange={setOpen} />
    </>
  );
}
