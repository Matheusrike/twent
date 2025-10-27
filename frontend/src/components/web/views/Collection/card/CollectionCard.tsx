'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HeartIcon, Import } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CollectionCardProps {
  id: string
  href: string
  image: string
  title: string
  description: string
  badge?: string
}

export default function CollectionCard({
  id,
  href,
  image,
  title,
  description,
  badge
}: CollectionCardProps) {
  const [liked, setLiked] = useState<boolean>(false)

  return (
    <Link href={href} key={id} className='block'>
      <div className='relative max-w-md rounded-xl bg-black pt-0  shadow-lg duration-500 overflow-hidden  hover:shadow-xl hover:-translate-y-1  '>
        {/* Image wrapper */}
        <div className='relative h-60 w-full flex items-center justify-center'>
          <Image
            src={image}
            alt={title}
            fill
            className='object-contain'
          />
        </div>

        {/* Like button */}
        <Button
          size='icon'
          onClick={(e) => {
            e.preventDefault() // Prevents navigating when clicking like
            setLiked(!liked)
          }}
          className='bg-primary/10 hover:bg-primary/20 absolute top-4 right-4 rounded-full '
        >
          <HeartIcon className={cn('size-4', liked ? 'fill-destructive stroke-destructive' : 'stroke-white')} />
          <span className='sr-only'>Like</span>
        </Button>

        {/* Card content */}
        <Card className='border-none! min-h-60 max-h-60 '>
          <CardHeader className='px-6 pt-4'>
            {/* Title and badge */}
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-2xl font-bold text-primary dark:text-primary">
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
            {/* Description */}
            <p className='text-gray-600 dark:text-gray-300 font-semibold'>
              {description}
            </p>
          </CardContent>
        </Card>
      </div>
    </Link>
  )
}
