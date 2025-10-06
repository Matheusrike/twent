"use client";

import CollectionCard from "../card/CollectionCard";
import PaginationWithIcon from "./pagination/pagination";

export default function CollectionHero() {
  const collections = {
    items: [
      {
        id: "1",
        href: "/collections/luxury",
        image: "/img/web/collections/luxury.jpg",
        title: "Luxury Collection",
        description: "Exclusive watches inspired by timeless elegance.",
        badge: "New",
      },
      {
        id: "2",
        href: "/collections/sport",
        image: "/img/web/collections/sport.jpg",
        title: "Sport Collection",
        description: "High-performance designs made for champions.",
        badge: "Hot",
      },
      {
        id: "3",
        href: "/collections/classic",
        image: "/img/web/collections/classic.jpg",
        title: "Classic Collection",
        description: "Iconic pieces that never go out of style.",
        badge: "Classic",
      },
      {
        id: "4",
        href: "/collections/modern",
        image: "/img/web/collections/modern.jpg",
        title: "Modern Collection",
        description: "Sleek and bold timepieces for a new generation.",
        badge: "Trend",
      },
      {
        id: "5",
        href: "/collections/vintage",
        image: "/img/web/collections/vintage.jpg",
        title: "Vintage Collection",
        description: "Inspired by timeless craftsmanship and heritage.",
        badge: "Retro",
      },
      {
        id: "6",
        href: "/collections/limited",
        image: "/img/web/collections/limited.jpg",
        title: "Limited Edition",
        description: "Rare designs crafted for true connoisseurs.",
        badge: "Limited",
      },
      {
        id: "7",
        href: "/collections/automatic",
        image: "/img/web/collections/automatic.jpg",
        title: "Automatic Collection",
        description: "Precision engineering powered by motion.",
        badge: "Auto",
      },
      {
        id: "8",
        href: "/collections/chronograph",
        image: "/img/web/collections/chronograph.jpg",
        title: "Chronograph Series",
        description: "Built for accuracy, speed, and timeless appeal.",
        badge: "Pro",
      },
      {
        id: "9",
        href: "/collections/royal",
        image: "/img/web/collections/royal.jpg",
        title: "Royal Edition",
        description: "Luxury and legacy combined in every detail.",
        badge: "Elite",
      },
    ],
  };


  return (
    <section className="py-5 container mx-auto px-6">


      {/* cards grid*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.items.map((collection) => (
          <CollectionCard
            key={collection.id}
            id={collection.id}
            href={collection.href}
            image={collection.image}
            title={collection.title}
            description={collection.description}
            badge={collection.badge}
          />
        ))}
      </div>
      <PaginationWithIcon />
    </section>
  );
}
