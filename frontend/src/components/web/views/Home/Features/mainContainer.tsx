"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/web/Global/ui/button";
import Link from "next/link";
import CollectionCard from "../../Collection/card/CollectionCard";
import mainContainerData from './json/mainContainerData.json';
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

        // Extrai badges com tipagem correta (type guard)
        const validBadges = normalized
          .map((p: any) => p?.collection?.name)
          .filter((n: unknown): n is string => 
            typeof n === "string" && n.trim().length > 0
          )
          .map((n: string) => n.trim());

        // Remove duplicatas e garante tipo string[]
        const distinctBadges: string[] = Array.from(new Set(validBadges));
        setBadges(distinctBadges);

        // Pega 3 produtos aleatórios para exibir na home
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
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-12">
            {/* text Content */}
            <div className="max-w-xl flex flex-col">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary mb-8 tracking-tight">
                Encontre o seu relógio ideal
              </h1>
              <p className="text-slate-700 dark:text-white text-lg md:text-xl mb-10 leading-relaxed font-light">
                Reunimos uma seleção de modelos icônicos para ajudá-lo(a) a encontrar o seu relógio perfeito.
              </p>

              {/* Image Mobile */}
              <div className="block md:hidden justify-center items-center relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden transition-transform duration-300 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                <MainImage />
              </div>

              {/* Button */}
              <Link href="/collection">
                <Button
                  variant="standartButton"
                  size="standartButton"
                  className="w-full md:w-2/4 px-10 py-6 tracking-wider mt-4"
                >
                  Explorar
                </Button>
              </Link>
            </div>

            {/* Image Desktop */}
            <div className="hidden md:block justify-center items-center relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden transition-transform duration-300 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
              <MainImage />
            </div>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <section className="py-24 container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary mb-6">
            Nossas Coleções
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubra peças exclusivas que combinam tradição e inovação
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Collection Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <CollectionCard
                  key={product.sku}
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
              ))}
            </div>

            {/* Mensagem caso não haja produtos */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  Nenhum produto disponível no momento.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Badges Section */}
      <div className="container mx-auto px-6 lg:px-12 pb-24">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-black dark:text-white uppercase">
          Coleções
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <Link key={badge} href={`/collection?collection=${encodeURIComponent(badge)}`}>
              <div className="group h-15 bg-white rounded-xl flex items-center justify-center transition-transform cursor-pointer px-4 relative overflow-hidden z-10 after:absolute after:h-1 after:w-1 after:bg-primary after:left-0 after:bottom-0 after:-z-10 after:rounded-full after:transition-all after:duration-1000 hover:after:scale-[300]">
                <span className="uppercase text-lg md:text-md font-semibold text-center text-gray-800 transition-all duration-1000 relative z-20 group-hover:text-white">
                  {badge}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContainer;