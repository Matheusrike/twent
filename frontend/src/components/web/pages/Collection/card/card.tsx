"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CollectionCardProps {
  id: string;
  href: string;
  image?: string;
  title: string;
  description: string;
  badge?: string;
}

export default function CollectionCard({
  id,
  href,
  image,
  title,
  description,
  badge,
}: CollectionCardProps) {
  return (
    <Link key={id} href={href}>
      <div className="group bg-white dark:bg-background border border-gray-200/50 dark:border-white/5 hover:border-primary dark:hover:border-primary transition-all duration-500 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-40 ">
        
        {/* Image wrapper */}
        <div className="relative overflow-hidden">
          <div className="relative w-full h-80">
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            )}
          </div>
          
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* badge */}
          {badge && (
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="bg-primary text-white px-3 py-1 text-sm font-semibold uppercase">
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 font-semibold mb-6">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <button className="text-primary dark:text-primary hover:text-primary/80 dark:hover:text-primary/80 transition-colors">
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
