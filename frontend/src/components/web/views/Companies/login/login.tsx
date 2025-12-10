"use client";

import { Logo } from "./logo";
import { Button } from "@/components/private/global/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/private/views/login/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import companyPortalData from "../json/companyPortalData.json";
import { Shield, Lock, Mail, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ICON_MAP: Record<string, any> = { shield: Shield };

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

const forgotSchema = z.object({
  email: z.string().email("Email inválido"),
});

const resetSchema = z.object({
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "As senhas não coincidem",
  path: ["password_confirmation"],
});

type LoginData = z.infer<typeof loginSchema>;
type ForgotData = z.infer<typeof forgotSchema>;
type ResetData = z.infer<typeof resetSchema>;

export default function Login() {
  const content = companyPortalData;
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<"request" | "reset" | "success">("request");
  const [emailSentTo, setEmailSentTo] = useState("");

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotForm = useForm<ForgotData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  useEffect(() => {
    if (token) {
      setStep("reset");
      setDialogOpen(true);
    }
  }, [token]);

  const onLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/response/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        loginForm.setError("root", { message: err.message || "Credenciais inválidas" });
        setIsLoading(false);
        return;
      }

      const meRes = await fetch("/response/api/user/me", { credentials: "include" });
      const meData = await meRes.json();

      if (!meRes.ok || !meData?.data) {
        loginForm.setError("root", { message: "Erro ao carregar perfil" });
        setIsLoading(false);
        return;
      }

      const role = meData.data.user_roles?.[0]?.role?.name;
      router.push(role === "ADMIN" ? "/private/dashboard" : "/private/pdv");
    } catch {
      loginForm.setError("root", { message: "Erro de conexão" });
      setIsLoading(false);
    }
  };

  const requestRecovery = async (data: ForgotData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/response/api/password-recovery/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (res.ok) {
        setEmailSentTo(data.email);
        setStep("success");
      } else {
        const err = await res.json().catch(() => ({}));
        forgotForm.setError("email", { message: err.message || "Erro ao enviar" });
      }
    } catch {
      forgotForm.setError("email", { message: "Erro de conexão" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetData) => {
    if (!token) {
      resetForm.setError("root", { message: "Token inválido" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/response/api/password-recovery/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password, password_confirmation: data.password_confirmation }),
      });

      if (res.ok) {
        setStep("success");
        setEmailSentTo("");
        setTimeout(() => {
          closeDialog();
        }, 2000);
      } else {
        const err = await res.json().catch(() => ({}));
        resetForm.setError("root", { message: err.message || "Erro ao redefinir senha" });
      }
    } catch {
      resetForm.setError("root", { message: "Erro de conexão" });
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setStep("request");
    setEmailSentTo("");
    forgotForm.reset();
    resetForm.reset();
    loginForm.clearErrors();
    if (token) {
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary dark:from-zinc-800 dark:to-zinc-900" />
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
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

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                          <Input type="email" placeholder="Digite seu e-mail" className="pl-12" disabled={isLoading} {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
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

                <Button variant="standartButton" size="standartButton" type="submit" className="w-full!" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                {loginForm.formState.errors.root && (
                  <p className="text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    {loginForm.formState.errors.root.message}
                  </p>
                )}
              </form>
            </Form>

            <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
              Esqueceu a senha?{" "}
              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setDialogOpen(true);
                }}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Clique aqui
              </button>
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">{content.features.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{content.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.features.items.map((feature: any, index: number) => {
              const Icon = ICON_MAP[feature.icon] || Shield;
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-500 hover:border-red-500/50 dark:hover:border-red-500/50 hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Icon className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
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
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{content.help}</p>
        </div>
      </footer>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === "request" && "Recuperar senha"}
              {step === "reset" && "Nova senha"}
              {step === "success" && "Concluído"}
            </DialogTitle>
            <DialogDescription>
              {step === "request" && "Digite seu e-mail para receber o link de recuperação."}
              {step === "reset" && "Defina uma nova senha segura."}
              {step === "success" &&
                (emailSentTo
                  ? `Link enviado para ${emailSentTo}. Verifique sua caixa de entrada.`
                  : "Senha alterada com sucesso! Faça login com a nova senha.")}
            </DialogDescription>
          </DialogHeader>

          {step === "request" && (
            <Form {...forgotForm}>
              <form onSubmit={forgotForm.handleSubmit(requestRecovery)} className="space-y-4">
                <FormField
                  control={forgotForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <div className="relative pt-2">
                          <Input type="email" placeholder="seu@email.com" className="" disabled={isLoading} {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="standartButton" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar link"}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === "reset" && (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(resetPassword)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            className="pl-10 pr-10"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={resetForm.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="Digite novamente" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {resetForm.formState.errors.root && (
                  <p className="text-sm text-red-600">{resetForm.formState.errors.root.message}</p>
                )}

                <Button type="submit" variant="standartButton" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Redefinir senha"}
                </Button>
              </form>
            </Form>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <Button variant="standartButton" onClick={closeDialog} className="w-full">
                OK
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}