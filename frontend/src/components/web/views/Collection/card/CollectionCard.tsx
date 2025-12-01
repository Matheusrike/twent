'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HeartIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface CollectionCardProps {
  sku: string
  image: string
  title: string
  description: string
  badge?: string
  index?: number
}

export default function CollectionCard({
  sku,
  image,
  title,
  description,
  badge,
  index = 0
}: CollectionCardProps) {
  const [liked, setLiked] = useState<boolean>(false)

  return (
    <Link href={`/collection/${sku}`} className='block'>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}   
        animate={{ opacity: 1, y: 0 }}    
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          delay: index * 0.1
        }} 
        className='relative max-w-md rounded-xl bg-zinc-600 pt-0 shadow-lg duration-500 overflow-hidden hover:shadow-xl hover:-translate-y-1'
      >

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
            e.preventDefault()
            e.stopPropagation()
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

      </motion.div>
    </Link>
  )
}