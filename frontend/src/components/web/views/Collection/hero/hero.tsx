"use client";

import { useState, useEffect } from 'react'
import CollectionCard from "../card/CollectionCard";
import PaginationWithIcon from "./pagination/pagination";
import { truncateText } from "@/utils/functions/truncateText";

interface Product {
  sku: string
  collection_id: string
  name: string
  description: string
  limited_edition: boolean
  price: string
  collection: {
    id: string
    name: string
    description: string
    image_public_id: string | null
  }
  images: Array<{ url: string }>
}

export default function CollectionHero() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Iniciando fetch...')
        const response = await fetch('/response/api/product/public')
        console.log('Response status:', response.status)
        
        const result = await response.json()
        console.log('Resultado da API:', result)
        
        if (result.success) {
          console.log('Produtos recebidos:', result.data)
          setProducts(result.data)
        } else {
          setError('Falha ao carregar produtos')
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
        setError('Erro ao conectar com a API')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  console.log('Estado atual - Loading:', loading, 'Products:', products.length, 'Error:', error)

  if (loading) {
    return (
      <section className="py-5 container mx-auto px-6">
        <div className="text-center py-10">Carregando produtos...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-5 container mx-auto px-6">
        <div className="text-center py-10 text-red-500">{error}</div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-5 container mx-auto px-6">
        <div className="text-center py-10">Nenhum produto encontrado</div>
      </section>
    )
  }

  return (
    <section className="py-5 container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <CollectionCard
            key={product.sku}
            sku={product.sku}
            // href={`/collection/${product.sku}`}   // 🔥 ROTA CORRIGIDA
            image={
              product.images?.[0]?.url ||
              product.collection.image_public_id ||
              '/placeholder.png'
            }
            title={product.name}
            description={truncateText(product.description, 100)}
            badge={product.collection.name}
          />
        ))}
      </div>
      <PaginationWithIcon />
    </section>
  );
}