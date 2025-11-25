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
import { Input } from "@/components/private/views/matriz/login/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import companyPortalData from "../json/companyPortalData.json";
import { Shield, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Icon mapping used in the features section
const ICON_MAP: Record<string, any> = {
  shield: Shield,
};

// Form validation schema
const formSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const content = companyPortalData;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
  try {
    setIsLoading(true);

    const response = await fetch("/response/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        result?.message || "Credenciais inválidas. Verifique seu email e senha.";
      form.setError("root", { message });
      return;
    }


    if (!result?.token) {
      form.setError("root", { message: "Login falhou: token não recebido." });
      return;
    }

    router.push("/matriz/dashboard");
  } catch (error) {
    form.setError("root", {
      message: "Erro de conexão. Tente novamente mais tarde.",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col">
      <section className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
        
        {/* Animated background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-300/20 dark:bg-zinc-700/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-400/20 dark:bg-zinc-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          
          {/* Form card */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-zinc-700/50 p-8 sm:p-10 transform transition-all duration-300 hover:scale-[1.02]">
            
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="transform transition-transform duration-300 hover:scale-110">
                <Logo />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold text-center mb-8">
              Bem-vindo de volta
            </h1>

            <Form {...form}>
              <div className="w-full space-y-5 flex flex-col">

                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 transition-colors"
                            size={20}
                          />
                          <Input
                            type="email"
                            autoComplete="off"
                            placeholder="Digite seu e-mail"
                            disabled={isLoading}
                            className="pl-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Lock
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 transition-colors"
                            size={20}
                          />

                          {/* Password input */}
                          <Input
                            autoComplete="off"
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            disabled={isLoading}
                            className="pl-12 pr-12"
                            {...field}
                          />

                          {/* Eye / EyeOff toggle */}
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <Button
                  variant="standartButton"
                  size="standartButton"
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Entrando...</span>
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                {/* Error message */}
                {form.formState.errors.root && (
                  <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 animate-shake">
                    {form.formState.errors.root.message}
                  </p>
                )}
              </div>
            </Form>

            {/* Forgot password link */}
            <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
              Esqueceu a senha?
              <Link
                className="font-semibold text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-white transition-all duration-200 ml-1"
                href="/forgot-password"
              >
                Clique aqui
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-background z-20">
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
                  className="group relative p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-500 hover:border-red-500/50 dark:hover:border-red-500/50 hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-red-500/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-linear-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
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

      {/* Help section */}
      <footer className="py-16 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-1 bg-linear-to-r from-red-600 to-red-800 rounded-full" />
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl text-center leading-relaxed">
              {content.help}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
