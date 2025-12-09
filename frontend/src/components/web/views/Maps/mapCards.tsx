import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface StoresListProps {
  data: any[];
  onStoreClick?: (store: any) => void;
}

export default function StoresList({ data, onStoreClick }: StoresListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);


  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedId(data[0].id);
      if (onStoreClick) onStoreClick(data[0]); 
    }
  }, [data]);

  const handleCardClick = (store: any) => {
    setSelectedId(store.id);
    if (onStoreClick) onStoreClick(store);
  };

  if (!data || !Array.isArray(data)) return null;

  return (
    <div className="flex flex-col gap-4">
      {data.map((store: any) => {
        const isSelected = selectedId === store.id;

        return (
          <Card
            key={store.id}
            onClick={() => handleCardClick(store)}
            className={`relative w-full cursor-pointer border transition-all
              bg-gray-100 dark:bg-zinc-900 shadow-sm hover:shadow-md
              hover:border-border
              ${
                isSelected
                  ? 'border-primary shadow-md dark:border-primary'
                  : 'border-transparent'
              }
            `}
          >
            <CardHeader className="py-5 px-5">
              <div className="flex flex-col gap-2">
                <h3
                  className={`font-semibold text-lg leading-snug line-clamp-1 ${
                    isSelected
                      ? 'text-primary dark:text-primary'
                      : 'text-foreground dark:text-gray-100'
                  }`}
                >
                  {store.name}
                </h3>

                <div className="flex items-center gap-2">
                  <MapPin
                    className={`w-4 h-4 flex-shrink-0 ${
                      isSelected
                        ? 'text-primary dark:text-primary'
                        : 'text-muted-foreground dark:text-gray-400'
                    }`}
                  />
                  <p
                    className={`text-sm leading-tight line-clamp-1 ${
                      isSelected
                        ? 'text-primary dark:text-primary'
                        : 'text-muted-foreground dark:text-gray-400'
                    }`}
                  >
                    {store.city}, {store.country}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
