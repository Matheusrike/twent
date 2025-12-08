'use client';

import { Button } from '@/components/web/Global/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import StoreCard from '../card/storeCard';
import ContactForm from '../contactForm/form';
import { useState, useEffect } from 'react';

interface Store {
    id: string;
    name: string;
    email?: string;
    city?: string;
    country?: string;
    phone?: string;
    opening_hours?: { day: string; open: string; close: string }[];
}

export default function CollectionIdSideBar({ sku }: { sku: string }) {
    const [showForm, setShowForm] = useState(false);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchStores() {
            try {
                console.log('SKU recebido no sidebar: ', sku);
                const response = await fetch('/response/api/store/product/' + sku, {
                    method: 'GET',
                });
                const json = await response.json();
                const data = Array.isArray(json?.data) ? json.data : [];
                if (!cancelled) setStores(data);
            } catch (err) {
                console.error('Erro ao carregar lojas', err);
            }
        }
        fetchStores();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleCardClick = (store: Store) => {
        setSelectedStore(store);
        setShowForm(true);
    };

    const handleBackClick = () => {
        setShowForm(false);
        setSelectedStore(null);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setShowForm(false);
            setSelectedStore(null);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <Sheet onOpenChange={handleOpenChange}>
                <SheetTrigger asChild>
                    <Button size="standartButton" variant="standartButton" className="w-full! h-12 ">
                        Contactar Uma Boutique
                    </Button>
                </SheetTrigger>

                <SheetContent side="right" className="p-6 flex flex-col gap-4">
                    {!showForm ? (
                        <div className="flex flex-col gap-4">
                            {stores.length > 0 ? (
                                stores.map((store) => (
                                    <StoreCard key={store.id} onClick={() => handleCardClick(store)} store={store} />
                                ))
                            ) : (
                                <p className="text-muted-foreground dark:text-white">Nenhuma boutique encontrada.</p>
                            )}
                        </div>
                    ) : (
                        <ContactForm onBack={handleBackClick} store={selectedStore ?? undefined} />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}