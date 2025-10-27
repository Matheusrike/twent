import { Button } from "@/components/web/Global/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import CollectionCard from "../../Collection/card/CollectionCard"
import mainContainerData from './json/mainContainerData.json'
import { MainImage } from "./img/images"
import { truncateText } from "@/utils/functions/truncateText";

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

        {/* collection preview*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.items.map((collection) => (
            <CollectionCard
              key={collection.id}
              id={collection.id}
              href={collection.href}
              image={collection.image}
              title={collection.title}
              description={truncateText(collection.description, 100)}
              badge={collection.badge}
            />
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