'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HeartIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CollectionCardProps {
  sku: string              // <-- SKU fazendo papel de ID
  image: string
  title: string
  description: string
  badge?: string
}

export default function CollectionCard({
  sku,
  image,
  title,
  description,
  badge
}: CollectionCardProps) {
  const [liked, setLiked] = useState<boolean>(false)

  return (
    <Link href={`/collection/${sku}`} className='block'> 
      <div className='relative max-w-md rounded-xl bg-zinc-600 pt-0 shadow-lg duration-500 overflow-hidden hover:shadow-xl hover:-translate-y-1'>
        
        <div className='relative h-60 w-full flex items-center justify-center'>
          <Image
            src={image}
            alt={title}
            fill
            className='object-contain'
          />
        </div>

        <Button
          size='icon'
          onClick={(e) => {
            e.stopPropagation() // impede o clique do botão acionar o Link
            setLiked(!liked)
          }}
          className='bg-primary/10 hover:bg-primary/20 absolute top-4 right-4 rounded-full'
        >
          <HeartIcon
            className={cn(
              'size-4',
              liked ? 'fill-destructive stroke-destructive' : 'stroke-white'
            )}
          />
          <span className='sr-only'>Like</span>
        </Button>

        <Card className='border-none min-h-60 max-h-60 bg-white dark:bg-black'>
          <CardHeader className='px-6 pt-4'>
            <div className='flex items-center justify-between gap-2'>
              <CardTitle className='text-2xl font-bold text-primary dark:text-primary'>
                {title}
              </CardTitle>

              {badge && (
                <Badge className='bg-primary text-white px-3 py-1 text-sm font-semibold uppercase'>
                  {badge}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className='px-6 pt-2 pb-4'>
            <p className='text-gray-600 dark:text-gray-300 font-semibold'>
              {description}
            </p>
          </CardContent>
        </Card>

      </div>
    </Link>
  )
}
