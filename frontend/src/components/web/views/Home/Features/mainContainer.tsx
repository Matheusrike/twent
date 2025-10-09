import { Button } from "@/components/web/Global/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import mainContainerData from './json/mainContainerData.json'
import { MainImage } from "./img/images"

interface Category {
  title: string
  href: string
}

interface Collection {
  id: string
  image: string
  badge: string
  title: string
  description: string
  price: string
  href: string
}

interface CollectionsData {
  title: string
  subtitle: string
  items: Collection[]
}

interface MainContainerData {
  categories: Category[]
  collections: CollectionsData
}

const MainContainer: React.FC = () => {
  const data = mainContainerData as MainContainerData
  const { categories, collections } = data

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-12">
            {/* text Content */}
            <div className="max-w-xl flex flex-col">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary mb-8 tracking-tight">
                Encontre o seu relógio ideal
              </h1>
              <p className="text-slate-700 dark:text-white text-lg md:text-xl mb-10 leading-relaxed font-light">
                Reunimos uma seleção de modelos icônicos para ajudá-lo(a) a encontrar o seu relógio perfeito.
              </p>

              {/* Image Mobile */}
              <div className="block md:hidden justify-center items-center relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden transition-transform duration-300 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                <MainImage />
              </div>

              {/* Button */}
              <Link href="/collection">
                <Button
                  variant="standartButton"
                  size="standartButton"
                  className="w-full md:w-2/4 px-10 py-6 tracking-wider mt-4"
                >
                  Explorar
                </Button>
              </Link>
            </div>

            {/* Image Desktop */}
            <div className="hidden md:block justify-center items-center relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden transition-transform duration-300 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
              <MainImage />
            </div>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <section className="py-24 container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary mb-6">
            {collections.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {collections.subtitle}
          </p>
        </div>
        {/* collection static clocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.items.map((collection) => (
            <Link key={collection.id} href={collection.href}>
              <div className="group bg-white dark:bg-background border border-gray-200/50 dark:border-white/5 hover:border-primary dark:hover:border-primary transition-all duration-500 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-80">
                    {/* <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    /> */}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="bg-primary text-white px-3 py-1 text-sm font-semibold uppercase">
                      {collection.badge}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">
                    {collection.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold mb-6">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <button className="text-primary dark:text-primary hover:text-primary/80 dark:hover:text-primary/80 transition-colors">
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <div className="container mx-auto px-6 lg:px-12 ">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-black dark:text-white uppercase">
          Categorias
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, i) => (
            <Link key={i} href={category.href}>
              <div className="group h-15 bg-white rounded-xl flex items-center justify-center transition-transform cursor-pointer px-4 relative overflow-hidden z-10 after:absolute after:h-1 after:w-1 after:bg-primary after:left-0 after:bottom-0 after:-z-10 after:rounded-full after:transition-all after:duration-1000 hover:after:scale-[300]">
                <span className="uppercase text-lg md:text-md font-semibold text-center text-gray-800 transition-all duration-1000 relative z-20 group-hover:text-white">
                  {category.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainContainer