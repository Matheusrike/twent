"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/web/Global/ui/button";
import Link from "next/link";
import CollectionCard from "../../Collection/card/CollectionCard";
import mainContainerData from "./json/mainContainerData.json";
import { MainImage } from "./img/images";
import { truncateText } from "@/utils/functions/truncateText";

interface Category {
  title: string;
  href: string;
}

interface Product {
  sku: string;
  name: string;
  description: string;
  price: string;
  collection: {
    name: string;
    image_public_id: string | null;
  };
  images: Array<{ url: string }>;
}

interface MainContainerData {
  categories: Category[];
}

const MainContainer: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<string[]>([]);

  const data = mainContainerData as MainContainerData;

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("/response/api/product/public");
        const result = await response.json();

        const payload = result?.data ?? result;
        const normalized = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.products)
          ? payload.products
          : [];

        const validBadges = normalized
          .map((p: any) => p?.collection?.name)
          .filter(
            (n: unknown): n is string =>
              typeof n === "string" && n.trim().length > 0
          )
          .map((n: string) => n.trim());

        const distinctBadges: string[] = Array.from(new Set(validBadges));
        setBadges(distinctBadges);

        const shuffled = [...normalized].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
        setBadges([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Background gradient animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-12">
            {/* Text Content */}
            <div className="max-w-xl flex flex-col space-y-6 -all duration-300 group-hover:w-24">
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                <span className="w-8 h-0.5 bg-primary"></span>
                Coleção Premium
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary mb-8 tracking-tight leading-tight">
                Encontre o seu relógio{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">ideal</span>
                </span>
              </h1>

              <p className="text-slate-700 dark:text-white text-lg md:text-xl mb-10 leading-relaxed font-light">
                Reunimos uma seleção de modelos icônicos para ajudá-lo(a) a
                encontrar o seu relógio perfeito.
              </p>

              {/* Image Mobile */}
              <div className="block md:hidden relative aspect-square w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl overflow-hidden transition-all duration-500 shadow-xl hover:shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <MainImage />
              </div>

              {/* Button */}
              <Link href="/collection" className="w-full md:w-auto">
                <Button
                  variant="standartButton"
                  size="standartButton"
                  className="w-full md:w-auto px-10 py-6 tracking-wider mt-4 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Explorar
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </Link>
            </div>

            {/* Image Desktop */}
            <div className="hidden md:block relative aspect-square w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl overflow-hidden transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-[1.02] group">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <MainImage />
            </div>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <section className="py-24 container mx-auto px-6 lg:px-12 relative">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            <span className="w-8 h-0.5 bg-primary"></span>
            Explore
            <span className="w-8 h-0.5 bg-primary"></span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary mb-6">
            Nossas Coleções
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
            Descubra peças exclusivas que combinam tradição e inovação
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-12 w-12 border border-primary opacity-20"></div>
            </div>
            <p className="text-zinc-400 text-sm">Carregando coleções...</p>
          </div>
        ) : (
          <>
            {/* Collection Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.sku}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CollectionCard
                    sku={product.sku}
                    image={
                      product.images?.[0]?.url ||
                      product.collection.image_public_id ||
                      "/placeholder.png"
                    }
                    title={product.name}
                    description={truncateText(product.description, 100)}
                    badge={product.collection.name}
                  />
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-400 text-lg">
                  Nenhum produto disponível no momento.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Badges Section */}
      <div className="container mx-auto px-6 lg:px-12 pb-20">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <Link
              key={badge}
              href={`/collection?collection=${encodeURIComponent(badge)}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="group h-16 bg-white dark:bg-zinc-950 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer px-4 relative overflow-hidden shadow-md hover:shadow-xl border border-zinc-200 dark:border-zinc-700">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="uppercase text-base md:text-sm font-semibold text-center text-zinc-800 dark:text-zinc-200 transition-all duration-300 relative z-10 group-hover:text-primary">
                  {badge}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default MainContainer;
