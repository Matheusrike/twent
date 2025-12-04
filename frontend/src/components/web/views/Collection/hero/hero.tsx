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
	searchQuery: string;
}

export default function CollectionHero({ searchQuery }: CollectionHeroProps) {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProducts() {
			try {
				const response = await fetch('/response/api/product/public');
				const result = await response.json();

				if (result.success) {
					setProducts(result.data.products);
				} else {
					setError('Falha ao carregar produtos');
				}
			} catch (error) {
				console.error('Erro ao buscar produtos:', error);
				setError('Erro ao conectar com a API');
			} finally {
				setLoading(false);
			}
		}

		fetchProducts();
	}, []);

	// FILTRA OS PRODUTOS COM BASE NA BUSCA
	const filteredProducts =
		searchQuery.trim() === ''
			? products
			: products.filter((product) =>
					product.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase().trim())
			  );

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
		<section className="py-5 container mx-auto px-6">
			{filteredProducts.length === 0 ? (
				<div className="text-center py-20 text-muted-foreground text-lg">
					{searchQuery
						? `Nenhum produto encontrado para "${searchQuery}"`
						: 'Nenhum produto disponível'}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredProducts.map((product) => (
						<CollectionCard
							key={product.sku}
							id={product.sku}
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
			{filteredProducts.length > 0 && <PaginationWithIcon />}
		</section>
	);
}
