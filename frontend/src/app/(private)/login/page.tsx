"use client";

import { Logo } from "../../../components/private/views/login/logo";
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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation"; // ✅ App Router
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2">
        {/* return button */}
        <div className="absolute top-4 left-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="w-full cursor-pointer sm:w-auto flex items-center justify-center text-muted-foreground hover:text-foreground"
          >

            <ArrowLeft className="mr-2 h-4 w-4 text-[#DE1A26]" />
            Voltar à página anterior
          </Button>
        </div>

        <div className="max-w-md m-auto w-full flex flex-col items-center justify-center relative">

          {/* title content */}
          {/* <div className="flex flex-col justify-start items-start w-full py-15">
            <h1 className="font-bold text-6xl">Bem-vindo</h1>
            <h2 className="font-semibold text-2xl text-muted-foreground">
              Insira seus dados
            </h2>
          </div> */}

          {/* logo content */}
          <div className="py-15 ">
            <Logo />
          </div>

          {/* form content */}
          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
                    <FormLabel className="font-semibold text-muted-foreground">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="standartButton"
                size="standartButton"
                type="submit"
                className="w-full! md:mt-4"
              >
                Login
              </Button>
            </form>
          </Form>

          <div className="mt-5 space-y-5">
            <Link
              href="#"
              className="text-sm block underline text-muted-foreground text-center"
            >
              Forgot your password?
            </Link>
          </div>
        </div>


        {/* banner */}
        <div className="hidden lg:block rounded-lg bg-muted"></div>
      </div>
    </div>
  );
};

export default Login;
