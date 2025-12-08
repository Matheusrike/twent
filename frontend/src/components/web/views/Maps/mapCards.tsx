import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';
import React from 'react';

export default function StoresList({ data }: { data: any }) {
    if (!data || !Array.isArray(data)) return null;

    return (
        <div className="grid grid-cols-1 gap-0 p-0">
            {data.map((store: any) => (
                <Card
                    key={store.id}
                    className="bg-gray-100 dark:bg-zinc-900 relative w-full lg:max-w-sm max-w-full shadow-none pt-0 border-none hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                    <CardHeader className="py-5">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="font-semibold text-foreground dark:text-gray-100 text-3xl">
                                    {store.name}
                                </h3>

                                <div className="flex items-start gap-2 mt-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground dark:text-gray-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                                        {store.city}, {store.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="relative space-y-3">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
                            <a
                                href={`tel:${store.phone?.replace(/\D/g, '')}`}
                                className="text-[15px] text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 transition-colors"
                            >
                                {store.phone || '—'}
                            </a>
                        </div>

                        <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground dark:text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="text-[15px] text-muted-foreground dark:text-gray-400 space-y-1">
                                {store.opening_hours?.length ? (
                                    store.opening_hours.map((hour: any, idx: any) => (
                                        <p key={idx}>
                                            {hour.day}: {hour.open} - {hour.close}
                                        </p>
                                    ))
                                ) : (
                                    <p>Horário não informado</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
