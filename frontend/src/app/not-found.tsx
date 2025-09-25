'use client'
import Link from "next/link";
import { Button } from "@/components/web/Global/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {

  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center ">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/img/global/light/iconLight.svg"
          width={72}
          height={72}
          alt="Logo TWENT"
          className="dark:hidden"
          priority
        />
        <Image
          src="/img/global/dark/iconDark.svg"
          width={72}
          height={72}
          alt="Logo TWENT"
          className="hidden dark:block"
          priority
        />
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-white">
            Página não encontrada
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Ops! A página que você procura não existe ou foi movida.
            Verifique o endereço ou volte para uma das opções abaixo.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center items-center">
          {/* back home */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-full sm:w-auto"
          >
            <Link
              href="/"
              className="flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <Home className="mr-2 h-4 w-4 text-[#DE1A26]" />
              Ir para o início
            </Link>
          </Button>

          {/* return to previous */}
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
      </div>
    </div>
  );
}
