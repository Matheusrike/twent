import {
  BadgeDollarSign,
  Route,
  ShieldCheck,
  Truck,
  Undo2,
  UserRoundCheck,
} from "lucide-react"
import Image from "next/image"

import faqDataImport from './faqData.json'

interface FaqItem {
  question: string
  answer: string
  icon: string
}

interface FaqData {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  items: FaqItem[]
}

const faqData: FaqData = faqDataImport as FaqData

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Undo2: Undo2,
  Route: Route,
  Truck: Truck,
  BadgeDollarSign: BadgeDollarSign,
  ShieldCheck: ShieldCheck,
  UserRoundCheck: UserRoundCheck
}

const FaqHero: React.FC = () => {
  const { hero, items } = faqData

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
      
        <Image
          src="/img/web/faq/banner.png"
          alt="FAQ Hero"
          fill
          className="object-cover"
          priority
        />


        <div className="absolute inset-0 bg-black/50" />


        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              {hero.title.split(' ')[0]}{" "}
              <span className="text-primary">
                {hero.title.split(' ').slice(1).join(" ")}
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {hero.description}
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-0.5 bg-primary" />
              <span className="text-primary font-medium tracking-wider">
                {hero.subtitle}
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Grid Section */}
      <section className="py-24 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto ">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {items.map(({ question, answer, icon }: FaqItem) => {
              const Icon = iconMap[icon] || ShieldCheck

              return (
                <div
                  key={question}
                  className="mx-2.5 lg:mx-0 group relative overflow-hidden border border-gray-200/50 dark:border-white/5 rounded-2xl p-10 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white dark:bg-background"
                >
                  {/* Hover gradient */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    aria-hidden="true"
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <div className="text-white relative bg-gradient-to-br from-primary to-primary/80 h-16 w-16 flex items-center justify-center rounded-2xl shadow-lg group-hover:shadow-primary/25 transition-all duration-500">
                          <Icon className="w-7 h-7" />
                        </div>
                      </div>

                      <div className="flex-1 pt-1">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                          {question}
                        </h3>
                      </div>
                    </div>

                    {/* Answer */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base lg:text-lg">
                      {answer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default FaqHero