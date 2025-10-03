import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, Building, ArrowRight, Shield, TrendingUp, Headphones } from "lucide-react"
import { Button } from "../../Global/ui/button"
import Link from "next/link"
import companyPortalData from "./json/companyPortalData.json"
import Image from "next/image"

// Types
interface CompanyUnit {
  id: string
  title: string
  description: string
  badge: string
  icon: string
  href: string
  features: string[]
}

interface FeatureItem {
  icon: string
  title: string
  description: string
}

interface ContentData {
  hero: {
    title: string
    subtitle: string
    description: string
    cta: string
  }
  selection: {
    title: string
    subtitle: string
  }
  features: {
    title: string
    subtitle: string
    items: FeatureItem[]
  }
  help: string
}

// Constants
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Building,
  Shield,
  TrendingUp,
  Headphones,
}

// Subcomponents
interface UnitCardProps {
  unit: CompanyUnit
  isPrimary?: boolean
}

function UnitCard({ unit, isPrimary = false }: UnitCardProps) {
  const IconComponent = ICON_MAP[unit.icon] || Building2

  return (
    <Link
      href={unit.href}
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded-2xl block"
      aria-label={`Acessar ${unit.title}`}
    >
      <Card className="rounded-2xl relative overflow-hidden cursor-pointer border border-gray-200/50 dark:border-white/5 shadow-lg 
      hover:border-red-600/50 dark:hover:border-red-500/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full bg-white dark:bg-background">

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-red-50/50 dark:from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />

        <CardHeader className="relative flex flex-col items-center p-8 space-y-6">

          {/* Icon */}
          <div className="relative">
            <div className={`absolute inset-0 ${isPrimary ? 'bg-red-600/20' : 'bg-gray-600/20'} blur-xl rounded-full`} />
            <div className={`relative ${isPrimary ? 'bg-gradient-to-br from-red-600 to-red-700' : 'bg-gradient-to-br from-gray-600 to-gray-800'} p-5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
              <IconComponent className={`w-6 h-6 ${isPrimary ? 'text-white' : 'text-red-600 dark:text-red-500'}`} aria-hidden="true" />
            </div>
          </div>

          {/* Title and Badge */}
          <div className="text-center w-full">
            <CardTitle className="text-2xl font-bold text-primary dark:text-primary mb-2">
              {unit.title}
            </CardTitle>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
              {unit.badge}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 w-full">
            {unit.features?.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                <div className="text-red-600 dark:text-red-500 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            className="w-full py-4 mt-4"
            aria-label={`Acessar portal ${unit.title}`}
            variant="standartButton"
          >
            ACESSAR {unit.title.toUpperCase()}
          </Button>

        </CardHeader>
      </Card>
    </Link>


  )
}

interface CompanyPortalData {
  units: CompanyUnit[]
  content: ContentData
}

// Main component
export function CompanyPortal() {
  const data = companyPortalData as CompanyPortalData
  const { units, content } = data

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Image container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/web/companies/companiesBanner.png"
            alt="Portal empresarial"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Text container aligned left */}
        <div className="absolute inset-y-0 left-0 z-20 px-6 lg:px-20 flex items-center h-full">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              {content.hero.title}{" "}
              <span className="text-red-500">{content.hero.subtitle}</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              {content.hero.description}
            </p>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-0.5 bg-red-500" />
              <span className="text-red-500 font-medium tracking-wider uppercase">
                {content.hero.cta}
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Access Selection */}
      <section className="py-24 px-6 ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {content.selection.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {content.selection.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {units.map((unit, index) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                isPrimary={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {content.features.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {content.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.features.items.map((feature, index) => {
              const IconComponent = ICON_MAP[feature.icon] || Shield
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <footer className="py-12 px-6 ">
        <div className="max-w-7xl mx-auto flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md text-center leading-relaxed">
            {content.help}
          </p>
        </div>
      </footer>
    </div>
  )
}