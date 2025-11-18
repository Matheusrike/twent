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
import { Shield } from "lucide-react";
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

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
  
      const response = await fetch("/response/api/auth/login", {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        const message =
          err?.message || "Credenciais inválidas. Verifique seu email e senha.";
  
        form.setError("root", { message });
  
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
      <section className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="transition-all duration-200">
          <div className="mx-auto flex items-center space-y-4 py-16 px-12 font-semibold text-gray-500 flex-col">
            <Logo />

            <h1 className="text-white text-2xl">Bem-vindo de volta</h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-100 space-y-4 flex flex-col z-20"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Digite seu e-mail"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Digite sua senha"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  variant="standartButton"
                  size="standartButton"
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>

     
                {form.formState.errors.root && (
                  <p className="text-red-500 text-sm text-center">
                    {form.formState.errors.root.message}
                  </p>
                )}
              </form>
            </Form>

            <p>
              Esqueceu a senha?
              <Link
                className="font-semibold text-white hover:text-red-500 transition-all duration-200 ml-1"
                href="/forgot-password"
              >
                Clique aqui
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Help Section */}
      <footer className="py-16 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-red-800 rounded-full" />
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
