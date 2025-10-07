"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/functions/formatCurrency";

interface CollectionCardProps {
  id: string;
  href: string;
  image?: string;
  title: string;
  description: string;
  badge?: string;
  value?: number;
}

export default function CollectionCard({
  id,
  href,
  image,
  title,
  description,
  badge,
  value
}: CollectionCardProps) {
  return (
    <Link key={id} href={href}>
      <div className="group bg-white dark:bg-background border border-gray-200/50 dark:border-white/5 hover:border-primary dark:hover:border-primary transition-all duration-500 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-40">

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


          {/* image hover */}
          {badge && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">

              {/* badge */}
              <span className="bg-primary text-white px-3 py-1 text-sm font-semibold uppercase tracking-wide rounded-md shadow-md">
                {badge}
              </span>

              {/* Value highlight */}
              {value && (
                <span className="text-white text-sm font-semibold bg-black/40 dark:bg-muted-foreground/40 backdrop-blur-sm px-3 py-1 rounded-md uppercase shadow-lg">
                  {formatCurrency(value)}
                </span>
              )}
            </div>
          )}
        </div>


        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">
            {title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 font-semibold mb-4">
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