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
  images: Array<{ url: string; is_primary?: boolean }>
}

// Agora recebe a busca como prop
interface CollectionHeroProps {
  searchQuery: string
  selectedCategories?: string[]
  selectedPrices?: string[]
}

export default function CollectionHero({ searchQuery, selectedCategories = [], selectedPrices = [] }: CollectionHeroProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const ITEMS_PER_PAGE = 9

  // Verifica se há filtros ativos
  const hasFilters = searchQuery.trim().length > 0 || selectedCategories.length > 0 || selectedPrices.length > 0

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        // Se há filtros, busca todos os produtos para filtrar no cliente
        // Caso contrário, usa paginação do servidor
        if (hasFilters) {
          // Busca todos os produtos quando há filtros
          const response = await fetch('/response/api/product/public?limit=10000')
          const result = await response.json()
          
          if (result.success) {
            setProducts(result.data.products || [])
            setTotalProducts(result.data.products?.length || 0)
          } else {
            setError('Falha ao carregar produtos')
          }
        } else {
          // Usa paginação do servidor quando não há filtros
          const response = await fetch(`/response/api/product/public?limit=${ITEMS_PER_PAGE}&page=${currentPage}`)
          const result = await response.json()
          
          if (result.success) {
            setProducts(result.data.products || [])
            const pagination = result.data.pagination || {}
            setTotalPages(pagination.totalPages || 1)
            setTotalProducts(pagination.total || 0)
          } else {
            setError('Falha ao carregar produtos')
          }
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
        setError('Erro ao conectar com a API')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, searchQuery, selectedCategories, selectedPrices])

  // Função para verificar se o preço está na faixa selecionada
  const checkPriceRange = (priceStr: string, ranges: string[]): boolean => {
    if (!ranges.length) return true
    
    // Converte o preço para número (remove formatação e converte)
    // O preço pode vir como "20000" ou "20000.00" do backend
    const price = parseFloat(String(priceStr).replace(/[^\d,.-]/g, "").replace(",", ".")) || 0
    
    // Função helper para converter string de número com separador de milhares para número
    const parsePriceValue = (value: string): number => {
      // Remove R$, espaços e mantém apenas números, pontos e vírgulas
      const cleaned = value.replace(/R\$\s*/g, "").trim()
      // Remove pontos (separadores de milhares) e converte vírgula para ponto (decimal)
      const numericStr = cleaned.replace(/\./g, "").replace(",", ".")
      return parseFloat(numericStr) || 0
    }
    
    return ranges.some(range => {
      // Remove R$ e espaços, mantém apenas números e separadores
      const cleanRange = range.replace(/R\$\s*/g, "").trim()
      
      // Verifica faixa "0 - 50.000"
      if (cleanRange === "0 - 50.000") return price >= 0 && price <= 50000
      
      // Verifica faixa "50.000 - 100.000"
      if (cleanRange === "50.000 - 100.000") return price >= 50000 && price <= 100000
      
      // Verifica faixa "100.000 - 200.000"
      if (cleanRange === "100.000 - 200.000") return price >= 100000 && price <= 200000
      
      // Verifica faixa "200.000 - 500.000"
      if (cleanRange === "200.000 - 500.000") return price >= 200000 && price <= 500000
      
      // Verifica faixa "500.000+"
      if (cleanRange === "500.000+") return price >= 500000
      
      // Fallback para formato genérico "min - max" (ex: "0 - 50.000")
      const rangeMatch = cleanRange.match(/^(.+?)\s*-\s*(.+)$/)
      if (rangeMatch) {
        const min = parsePriceValue(rangeMatch[1])
        const max = parsePriceValue(rangeMatch[2])
        if (!isNaN(min) && !isNaN(max)) return price >= min && price <= max
      }
      
      // Fallback para formato "+" (maior que, ex: "500.000+")
      const plusMatch = cleanRange.match(/^(.+?)\+$/)
      if (plusMatch) {
        const min = parsePriceValue(plusMatch[1])
        if (!isNaN(min)) return price >= min
      }
      
      return false
    })
  }

  const categoriesKey = selectedCategories.join(',');
  const pricesKey = selectedPrices.join(',');
  
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoriesKey, pricesKey])

  // Scroll para o topo quando a página mudar
  useEffect(() => {
    const filtersSection = document.getElementById('filters');
    if (filtersSection) {
      filtersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage])

  // Aplica filtros nos produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery.trim() || product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    const matchesCategory = !selectedCategories.length || selectedCategories.some(cat => cat.toLowerCase().trim() === product.collection.name.toLowerCase().trim())
    const matchesPrice = checkPriceRange(product.price, selectedPrices)
    return matchesSearch && matchesCategory && matchesPrice
  })

  // Calcula paginação baseada em se há filtros ou não
  let finalTotalPages = totalPages
  let pagedProducts = products

  if (hasFilters) {
    // Quando há filtros, pagina no cliente
    finalTotalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    pagedProducts = filteredProducts.slice(start, end)
  } else {
    // Quando não há filtros, produtos já vêm paginados do servidor
    pagedProducts = products
  }

  // Função helper para obter a imagem principal ou a primeira disponível
  const getPrimaryImage = (product: Product): string | null => {
    if (!product.images || product.images.length === 0) {
      return product.collection.image_public_id || null
    }
    
    // Busca a imagem com is_primary: true
    const primaryImage = product.images.find(img => img.is_primary === true)
    if (primaryImage?.url) {
      return primaryImage.url
    }
    
    // Fallback para a primeira imagem se não houver principal definida
    return product.images[0]?.url || product.collection.image_public_id || null
  }

  if (loading) {
    return (
      <section className="py-5 container mx-auto px-6">
        <div className="text-center py-20">Carregando produtos...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-5 container mx-auto px-6">
        <div className="text-center py-20 text-red-500">{error}</div>
      </section>
    )
  }

  const displayProducts = hasFilters ? filteredProducts : products
  const hasProducts = displayProducts.length > 0

  return (
    <section className="py-5 container mx-auto">
      {!hasProducts ? (
        <div className="text-center py-20 text-muted-foreground text-lg">
          {selectedCategories.length > 0
            ? "Nenhum card encontrado para a badge selecionada"
            : selectedPrices.length > 0
              ? "Nenhum produto encontrado na faixa de preço selecionada"
              : searchQuery
              ? `Nenhum produto encontrado para "${searchQuery}"`
              : "Nenhum produto disponível"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pagedProducts.map((product) => (
            <CollectionCard
              key={product.sku}
              sku={product.sku}
              image={getPrimaryImage(product) || '/placeholder.png'}
              title={product.name}
              description={truncateText(product.description, 100)}
              badge={product.collection.name}
            />
          ))}
        </div>
      )}
      {hasProducts && finalTotalPages > 1 && (
        <div className="mt-8">
          <PaginationWithIcon
            currentPage={currentPage}
            totalPages={finalTotalPages}
            onPageChange={(page) => {
              const next = Math.min(Math.max(1, page), finalTotalPages)
              setCurrentPage(next)
            }}
          />
        </div>
      )}
    </section>
  );
}
