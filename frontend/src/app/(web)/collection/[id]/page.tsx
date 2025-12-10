'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { notFound, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/web/Global/ui/button"
import { formatCurrency } from "@/utils/functions/formatCurrency"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import CollectionIdSideBar from "@/components/web/views/Collection/id/sideBar/navigation-sheet"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/web/views/Collection/id/carousel/carousel"

interface Product {
  sku: string
  collection_id: string
  name: string
  description: string
  limited_edition: boolean
  price: string
  currency: string
  specifications: {
    glass: string
    total_weight: number
    case_diameter: number
    case_material: string
    movement_type: string
  }
  collection: {
    id: string
    name: string
    description: string
    image_public_id: string | null
  }
  images: Array<{ url?: string; public_id?: string; is_primary?: boolean }>
}

export default function CollectionIdHero() {
  const router = useRouter()
  const params = useParams()
  const sku = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const [desktopApi, setDesktopApi] = useState<CarouselApi>()
  const [mobileApi, setMobileApi] = useState<CarouselApi>()
  const [desktopCurrent, setDesktopCurrent] = useState(0)
  const [mobileCurrent, setMobileCurrent] = useState(0)

  useEffect(() => {
    // Verifica se o SKU está disponível antes de fazer a requisição
    if (!sku) {
      console.error('SKU não encontrado nos parâmetros')
      notFound()
      return
    }

    async function fetchProduct() {
      try {
        const response = await fetch(`/response/api/product/public/${sku}`, {
          credentials: 'include',
        })
        
        if (!response.ok) {
          console.error('Erro na resposta:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Detalhes do erro:', errorText)
          notFound()
          return
        }

        const result = await response.json()

        if (result.success && result.data) {
          setProduct(result.data)
        } else {
          console.error('Resposta sem dados válidos:', result)
          notFound()
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [sku])

  useEffect(() => {
    if (!desktopApi) return
    setDesktopCurrent(desktopApi.selectedScrollSnap())
    desktopApi.on("select", () => setDesktopCurrent(desktopApi.selectedScrollSnap()))
  }, [desktopApi])

  useEffect(() => {
    if (!mobileApi) return
    setMobileCurrent(mobileApi.selectedScrollSnap())
    mobileApi.on("select", () => setMobileCurrent(mobileApi.selectedScrollSnap()))
  }, [mobileApi])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando produto...</p>
      </div>
    )
  }

  if (!product) return null

  // Helper para normalizar URLs vindas da API (remove crases/aspas/espaços e constrói URL do Cloudinary a partir do public_id)
  const buildCloudinaryUrl = (input: string) => {
    const cleaned = (input || "").replace(/[`'\"]/g, "").trim();
    if (!cleaned) return "";
    if (cleaned.startsWith("http")) return cleaned;
    return `https://res.cloudinary.com/twent/image/upload/c_fill,q_auto/v1/${cleaned}.webp`;
  };
  // Imagens para o carrossel: prioriza a imagem principal, depois as outras; exibe todas as imagens
  const images = (() => {
    if (!product.images || product.images.length === 0) {
      const fallbackSrc = product.collection?.image_public_id || "";
      const finalFallback = buildCloudinaryUrl(fallbackSrc) || "";
      return finalFallback ? [{ url: finalFallback }] : [];
    }
    
    // Ordena colocando a imagem principal primeiro
    const sortedImages = [...product.images].sort((a, b) => {
      if (a.is_primary === true && b.is_primary !== true) return -1;
      if (a.is_primary !== true && b.is_primary === true) return 1;
      return 0;
    });
    
    const normalized = sortedImages
      .map((img) => {
        const src = img?.url || img?.public_id || "";
        const finalUrl = buildCloudinaryUrl(src);
        return finalUrl ? { url: finalUrl } : null;
      })
      .filter(Boolean) as Array<{ url: string }>;
  
    if (normalized.length > 0) return normalized;
  
    const fallbackSrc = product.collection?.image_public_id || "";
    const finalFallback = buildCloudinaryUrl(fallbackSrc) || "";
    return finalFallback ? [{ url: finalFallback }] : [];
  })();

  const hasMultipleImages = images.length > 1

  return (
    <div className="w-full">
      <div className="min-h-screen w-full flex flex-col lg:flex-row">

        {/* ====================== CARROSSEL DESKTOP ====================== */}
        <div className="hidden lg:flex lg:w-3/5 xl:w-4/5 h-screen sticky top-0 p-4 flex-col gap-6">
          <Carousel
            key={sku}
            setApi={setDesktopApi}
            className="w-full h-screen"
            opts={{ loop: true }}
          >
            <CarouselContent className="h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={image.url}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-cover object-center transition-transform duration-500 hover:scale-105"
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 80vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {hasMultipleImages && (
              <>
                <CarouselPrevious className="left-8 h-12 w-12 bg-white/95 hover:bg-white border-2 border-gray-200 shadow-lg hover:scale-110 transition-all" />
                <CarouselNext className="right-8 h-12 w-12 bg-white/95 hover:bg-white border-2 border-gray-200 shadow-lg hover:scale-110 transition-all" />
              </>
            )}
          </Carousel>

          {/* Indicadores Desktop */}
          {hasMultipleImages && (
            <div className="flex justify-center gap-2.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => desktopApi?.scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === desktopCurrent
                      ? 'w-10 bg-[#DE1A26] shadow-md shadow-red-500/50'
                      : 'w-2.5 bg-gray-300 hover:w-6 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ====================== CARROSSEL MOBILE ====================== */}
        <div className="lg:hidden w-full px-4 pt-4 pb-6">
          <Carousel
            key={sku}
            setApi={setMobileApi}
            className="w-full h-screen"
            opts={{ loop: true }}
          >
            <CarouselContent className="h-screen">
              {images.map((image, index) => (
                <CarouselItem key={index} className="h-screen">
                  <div className="relative w-full h-full">
                    <Image
                      src={image.url}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-cover object-center"
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {hasMultipleImages && (
              <>
                <CarouselPrevious className="left-3 h-10 w-10 bg-white/95 border-2 border-gray-200 shadow-lg" />
                <CarouselNext className="right-3 h-10 w-10 bg-white/95 border-2 border-gray-200 shadow-lg" />
              </>
            )}
          </Carousel>

          {/* Indicadores Mobile */}
          {hasMultipleImages && (
            <div className="flex justify-center gap-2.5 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => mobileApi?.scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === mobileCurrent
                      ? 'w-10 bg-[#DE1A26] shadow-md shadow-red-500/50'
                      : 'w-2.5 bg-gray-300 hover:w-6'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ====================== INFORMAÇÕES DO PRODUTO ====================== */}
        <div className="w-full lg:w-2/5 xl:w-1/2 flex flex-col px-6 py-8 lg:px-12 lg:py-16 lg:overflow-y-auto bg-white dark:bg-black">
          <div className="hidden lg:flex w-full mb-8 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4 text-[#DE1A26]" />
              Voltar à página anterior
            </Button>
          </div>

          <div className="flex flex-col items-start w-full">
            {product.collection.name && (
              <Badge variant="secondary" className="rounded-full py-1 text-sm bg-gray-100 dark:bg-white/10">
                {product.collection.name}
              </Badge>
            )}

            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-semibold leading-tight tracking-tighter">
              {product.name}
            </h1>

            {product.price && (
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-4">
                {formatCurrency(parseFloat(product.price))}
              </p>
            )}

            <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-10 w-full space-y-6">
              <h2 className="text-xl font-semibold">Especificações</h2>
              <div className="space-y-4 text-sm">
                {product.sku && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <span className="text-gray-500 dark:text-gray-400">Referência</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                )}
                {product.specifications.case_material && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <span className="text-gray-500 dark:text-gray-400">Material da caixa</span>
                    <span className="font-medium">{product.specifications.case_material}</span>
                  </div>
                )}
                {product.specifications.movement_type && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <span className="text-gray-500 dark:text-gray-400">Movimento</span>
                    <span className="font-medium">{product.specifications.movement_type}</span>
                  </div>
                )}
                {product.specifications.case_diameter && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <span className="text-gray-500 dark:text-gray-400">Diâmetro</span>
                    <span className="font-medium">{product.specifications.case_diameter} mm</span>
                  </div>
                )}
                {product.specifications.glass && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <span className="text-gray-500 dark:text-gray-400">Vidro</span>
                    <span className="font-medium">{product.specifications.glass}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-20 lg:mt-auto">
            <CollectionIdSideBar sku={product.sku} />
          </div>
        </div>
      </div>
    </div>
  )
}