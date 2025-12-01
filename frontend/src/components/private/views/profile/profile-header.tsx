"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfileHeader() {
  // get profile data
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    created_at: "",
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
        const createdAt = new Date(data.created_at);
        const formattedDate =
          createdAt.getDate().toString().padStart(2, "0") +
          "/" +
          (createdAt.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          createdAt.getFullYear();
        setUser({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          role: data.user_roles?.[0]?.role?.name || null,
          created_at: formattedDate,
        });
      } catch (err) {
        console.error("Erro ao buscar dados do usuário", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 text-2xl">
              <AvatarFallback className="text-2xl">
                {(user?.first_name?.[0] ?? "") + (user?.last_name?.[0] ?? "")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">
                {" "}
                {user.first_name} {user.last_name}
              </h1>
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Entrou em {user.created_at}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
