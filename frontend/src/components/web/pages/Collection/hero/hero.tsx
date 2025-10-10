"use client";

import CollectionCard from "../card/CollectionCard";
import PaginationWithIcon from "./pagination/pagination";
import cardsDataTest from '../cardsDataTest.json'

export default function CollectionHero() {
  return (
    <section className="py-5 container mx-auto px-6">


      {/* cards grid*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cardsDataTest.items.map((collection) => (
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
