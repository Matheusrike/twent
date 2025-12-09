"use client";

import Image from "next/image";
import { Logo } from "./logo";
import { Button } from "@/components/private/global/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/private/views/login/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter} from "next/navigation";
import companyPortalData from "../json/companyPortalData.json";
import { Shield, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const ICON_MAP: Record<string, any> = {
  shield: Shield,
};

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const content = companyPortalData;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/response/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        form.setError("root", {
          message: result?.message || "Credenciais inválidas. Verifique seu email e senha.",
        });
        setIsLoading(false);
        return;
      }

      const meResponse = await fetch("/response/api/user/me", {
        method: "GET",
        credentials: "include",
      });

      const meData = await meResponse.json().catch(() => null);

      if (!meResponse.ok || !meData) {
        form.setError("root", { message: "Erro ao carregar perfil do usuário." });
        setIsLoading(false);
        return;
      }

      const userRole = meData?.data?.user_roles?.[0]?.role?.name;

      if (userRole === "ADMIN") {
        router.push("/private/dashboard");
      } else {
        router.push("/private/pdv");
      }
    } catch (error) {
      form.setError("root", { message: "Erro de conexão. Tente novamente mais tarde." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary dark:from-zinc-800 dark:to-zinc-900" />
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path
                fill="currentColor"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/90 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-700/50 p-8 sm:p-10">
            <div className="flex justify-center mb-8">
              <div className="hover:scale-110 transition-transform duration-300">
                <Logo />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Bem-vindo de volta
            </h1>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                          <Input
                            type="email"
                            placeholder="Digite seu e-mail"
                            className="pl-12"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            className="pl-12 pr-12"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  variant="standartButton"
                  size="standartButton"
                  type="submit"
                  className="w-full!"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                {form.formState.errors.root && (
                  <p className="text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    {form.formState.errors.root.message}
                  </p>
                )}
              </form>
            </Form>

            <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
              Esqueceu a senha?{" "}
              <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
                Clique aqui
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {content.features.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              {content.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.features.items.map((feature, index) => {
              const IconComponent = ICON_MAP[feature.icon] || Shield;

              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 
                             border border-gray-100 dark:border-gray-500 
                             hover:border-red-500/50 dark:hover:border-red-500/50 
                             hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <IconComponent className="text-white w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary-600 rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {content.help}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;