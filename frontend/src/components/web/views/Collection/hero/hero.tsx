'use client';

import { useState, useEffect } from 'react';
import CollectionCard from '../card/CollectionCard';
import PaginationWithIcon from './pagination/pagination';
import { truncateText } from '@/utils/functions/truncateText';

interface Product {
	sku: string;
	collection_id: string;
	name: string;
	description: string;
	limited_edition: boolean;
	price: string;
	collection: {
		id: string;
		name: string;
		description: string;
		image_public_id: string | null;
	};
	images: Array<{ url: string }>;
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
  const ITEMS_PER_PAGE = 9

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/response/api/product/public?limit=1000')
        const result = await response.json()
        
        if (result.success) {
          setProducts(result.data.products)
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

		fetchProducts();
	}, []);

function checkPriceRange(priceStr: string, ranges: string[]): boolean {
  if (!ranges.length) return true
  const price = parseInt(String(priceStr).replace(/\D/g, ""))
  return ranges.some(range => {
    if (/^\d+-\d+$/.test(range)) {
      const [minStr, maxStr] = range.split("-")
      const min = parseInt(minStr)
      const max = parseInt(maxStr)
      if (!isNaN(min) && !isNaN(max)) return price >= min && price <= max
    }
    if (range === "50.000 - 100.000") return price >= 50000 && price <= 100000
    if (range === "100.000 - 200.000") return price >= 100000 && price <= 200000
    if (range === "200.000 - 500.000") return price >= 200000 && price <= 500000
    if (range === "500.000+") return price >= 500000
    return false
  })
}

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery.trim() || product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    const matchesCategory = !selectedCategories.length || selectedCategories.includes(product.collection.name)
    const matchesPrice = checkPriceRange(product.price, selectedPrices)
    return matchesSearch && matchesCategory && matchesPrice
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategories.join(','), selectedPrices.join(',')])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const pagedProducts = filteredProducts.slice(start, end)

	if (loading) {
		return (
			<section className="py-5 container mx-auto px-6">
				<div className="text-center py-20">Carregando produtos...</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="py-5 container mx-auto px-6">
				<div className="text-center py-20 text-red-500">{error}</div>
			</section>
		);
	}

  return (
    <section className="py-5 container mx-auto">
      {filteredProducts.length === 0 ? (
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
      )}
      {filteredProducts.length > 0 && (
        <div className="mt-8">
          <PaginationWithIcon
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              const next = Math.min(Math.max(1, page), totalPages)
              setCurrentPage(next)
            }}
          />
        </div>
      )}
    </section>
  );
}
