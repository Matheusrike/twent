'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/web/Global/ui/button';
import { formatCurrency } from '@/utils/functions/formatCurrency';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CollectionIdSideBar from '@/components/web/views/Collection/id/sideBar/navigation-sheet';
import CollectionBannerId from '@/components/web/views/Collection/banner/banner';
import TextCardsCollection from '@/components/web/views/Collection/id/card/TextCardsCollection';

interface Product {
	sku: string;
	collection_id: string;
	name: string;
	description: string;
	limited_edition: boolean;
	price: string;
	currency: string;
	specifications: {
		glass: string;
		total_weight: number;
		case_diameter: number;
		case_material: string;
		movement_type: string;
	};
	collection: {
		id: string;
		name: string;
		description: string;
		image_public_id: string | null;
	};
	images: Array<{ url: string }>;
}

export default function CollectionIdHero() {
	const router = useRouter();
	const { id: sku } = useParams();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchProduct() {
			try {
				const response = await fetch(
					`/response/api/product/public/${sku}`
				);
				const result = await response.json();

				if (result.success) {
					setProduct(result.data);
				} else {
					notFound();
				}
			} catch (error) {
				console.error('Erro ao buscar produto:', error);
				notFound();
			} finally {
				setLoading(false);
			}
		}

		fetchProduct();
	}, [sku]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Carregando produto...</p>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Produto não encontrado.</p>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
				<div className="flex flex-col lg:flex-row w-full min-h-screen">
					<div className="hidden lg:flex lg:w-3/5 xl:w-4/5 h-screen sticky top-0 p-4 flex-col gap-4">
						<div className="relative w-full lg:h-2/3 md:h-1/2 rounded-2xl overflow-hidden">
							<Image
								src={
									product!.images?.[0]?.url ||
									'/images/collection/gradient.png'
								}
								alt={product!.name}
								fill
								className="object-cover object-center bg-gray-300"
								priority
							/>
						</div>

						<div className="flex gap-4 w-full lg:h-1/3 md:h-1/2">
							<div className="relative w-1/2 h-full rounded-2xl overflow-hidden">
								<Image
									src={
										product!.images?.[1]?.url ||
										'/images/collection/gradient.png'
									}
									alt={product!.name}
									fill
									className="object-cover object-center bg-gray-300"
									priority
								/>
							</div>
							<div className="relative w-1/2 h-full rounded-2xl overflow-hidden">
								<Image
									src={
										product!.images?.[2]?.url ||
										'/images/collection/gradient.png'
									}
									alt={product!.name}
									fill
									className="object-cover object-center bg-gray-300"
									priority
								/>
							</div>
						</div>
					</div>

					<div className="lg:hidden w-full px-4 pt-4 pb-2 flex flex-col gap-4">
						<div className="relative w-full h-[300px] sm:h-[400px]">
							<Image
								src={product!.images?.[0]?.url}
								alt={product!.name}
								fill
								className="object-cover object-center bg-gray-300 rounded-2xl"
								priority
							/>
						</div>
					</div>

					<div className="w-full lg:h-220 lg:w-2/5 xl:w-1/2 flex flex-col px-6 py-8 lg:px-12 lg:py-15 lg:overflow-y-auto">
						<div className="hidden lg:flex w-full mb-6 justify-end">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => router.back()}
								className="cursor-pointer flex items-center text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft className="mr-2 h-4 w-4 text-[#DE1A26]" />
								Voltar à página anterior
							</Button>
						</div>

						<div className="flex flex-col items-start w-full">
							{product!.collection.name && (
								<Badge
									variant="secondary"
									className="rounded-full py-1 border-border dark:border-white/40 text-sm bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200"
									asChild
								>
									<span>{product!.collection.name}</span>
								</Badge>
							)}
							<h1 className="mt-6 max-w-[17ch] text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-semibold leading-tight tracking-tighter dark:text-white">
								{product!.name}
							</h1>
							{product!.price && (
								<p className="text-2xl sm:text-3xl font-bold text-primary mt-4">
									{formatCurrency(parseFloat(product!.price))}
								</p>
							)}

							<p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-200">
								{product!.description}
							</p>

							<div className="mt-8 w-full space-y-4">
								<h2 className="text-lg sm:text-xl font-semibold dark:text-white">
									Especificações
								</h2>
								<div className="space-y-3 text-sm">
									{product!.sku && (
										<div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
											<span className="text-gray-600 dark:text-red-500">
												Referência
											</span>
											<span className="font-medium dark:text-white">
												{product!.sku}
											</span>
										</div>
									)}
									{product!.specifications.case_material && (
										<div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
											<span className="text-gray-600 dark:text-red-500">
												Material
											</span>
											<span className="font-medium dark:text-white">
												{
													product!.specifications
														.case_material
												}
											</span>
										</div>
									)}
									{product!.specifications.movement_type && (
										<div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
											<span className="text-gray-600 dark:text-red-500">
												Movimento
											</span>
											<span className="font-medium dark:text-white">
												{
													product!.specifications
														.movement_type
												}
											</span>
										</div>
									)}
									{product!.specifications.case_diameter && (
										<div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
											<span className="text-gray-600 dark:text-red-500">
												Diâmetro
											</span>
											<span className="font-medium dark:text-white">
												{
													product!.specifications
														.case_diameter
												}
												mm
											</span>
										</div>
									)}
									{product!.specifications.glass && (
										<div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
											<span className="text-gray-600 dark:text-red-500">
												Vidro
											</span>
											<span className="font-medium dark:text-white">
												{product!.specifications.glass}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>

						<CollectionIdSideBar />
					</div>
				</div>
				<CollectionBannerId />
				<TextCardsCollection />
			</div>
		</div>
	);
}
