"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/private/global/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/private/views/login/input";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Logo } from "@/components/web/views/Companies/login/logo";

const resetSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

type ResetData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Token não encontrado na URL");
        setIsValidating(false);
        return;
      }

      try {
        const res = await fetch(`/response/api/password-recovery/validate/${token}`, {
          method: "GET",
        });

        if (res.ok) {
          setTokenValid(true);
        } else {
          const err = await res.json().catch(() => ({}));
          setError(err.message || "Token inválido ou expirado");
        }
      } catch {
        setError("Erro ao validar token");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetData) => {
    if (!token) {
      resetForm.setError("root", { message: "Token inválido" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/response/api/password-recovery/reset", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/companies/login");
        }, 2000);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.message || "Erro ao redefinir senha");
        resetForm.setError("root", { message: err.message || "Erro ao redefinir senha" });
      }
    } catch {
      setError("Erro de conexão");
      resetForm.setError("root", { message: "Erro de conexão" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Validando token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Token Inválido
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "O token de recuperação é inválido ou expirou. Por favor, solicite um novo link de recuperação."}
          </p>
          <Button
            variant="standartButton"
            onClick={() => router.push("/companies/login")}
            className="w-full"
          >
            Voltar para o Login
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Senha Redefinida!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 sm:p-10">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Redefinir Senha
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Digite sua nova senha abaixo
        </p>

        <Form {...resetForm}>
          <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
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

            <FormField
              control={resetForm.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <Input
                        type={showPasswordConfirmation ? "text" : "password"}
                        placeholder="Digite novamente"
                        className="pl-12 pr-12"
                        disabled={isLoading}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {resetForm.formState.errors.root && (
              <p className="text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                {resetForm.formState.errors.root.message}
            </p>
            )}

            {error && (
              <p className="text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                {error}
              </p>
            )}

            <Button
              variant="standartButton"
              size="standartButton"
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Lembrou sua senha?{" "}
          <button
            type="button"
            onClick={() => router.push("/companies/login")}
            className="font-semibold text-primary hover:underline cursor-pointer"
          >
            Voltar para o Login
          </button>
        </p>
      </div>
    </div>
  );
}

