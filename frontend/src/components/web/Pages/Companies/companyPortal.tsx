import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, Building, ArrowRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import companyPortalData from "./json/companyPortalData.json"

// Types
interface CompanyUnit {
  id: string
  title: string
  description: string
  badge: string
  icon: string
  href: string
}

// Constants
const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Building,
} as const

const CONTENT = {
  header: {
    title: "Portal Empresarial",
    subtitle: "Selecione a unidade que deseja acessar",
  },
  cta: "Acessar",
  help: "Precisa de ajuda? Entre em contato com o suporte da sua unidade.",
} as const

// Subcomponents
interface UnitCardProps {
  unit: CompanyUnit
}

function UnitCard({ unit }: UnitCardProps) {
  const IconComponent = ICON_MAP[unit.icon] || Building2

  return (
    <Link 
      href={unit.href} 
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded-lg"
      aria-label={`Acessar ${unit.title}`}
    >
      <Card className="relative overflow-hidden cursor-pointer border border-gray-200/50 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full bg-white dark:bg-background backdrop-blur-sm">
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-red-50/50 dark:from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
          aria-hidden="true"
        />

        <CardHeader className="relative flex flex-col items-start p-10 space-y-8">
          {/* Icon container */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full" />
            <div className="relative bg-gradient-to-br from-red-600 to-red-700 p-5 rounded-2xl shadow-lg group-hover:shadow-red-500/25 transition-all duration-500">
              <IconComponent className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 flex-1 w-full">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-500 transition-colors duration-300 leading-tight">
                {unit.title}
              </CardTitle>
               <span 
                className="px-4 py-1.5 bg-gradient-to-r from-red-50 to-red-100 dark:bg-red-600 text-red-700 dark:text-rre-700 text-xs font-semibold rounded-full border border-red-200/50 dark:border-red-500/30 whitespace-nowrap"
                aria-label={`Tipo: ${unit.badge}`}
              >
                {unit.badge}
              </span>
            </div>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
              {unit.description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-semibold group-hover:gap-3 transition-all duration-300 pt-2">
            <span className="text-sm tracking-wide">{CONTENT.cta}</span>
            <ArrowRight 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              aria-hidden="true"
            />
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

// Main component
export function CompanyPortal() {
  const units = companyPortalData as CompanyUnit[]

  return (
    <div className="mx-auto px-6 lg:px-20 p-5 flex flex-col w-full items-center">
      {/* Header */}
      <header className="w-full max-w-7xl mb-10  text-center lg:text-left  ">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary dark:text-white mb-10 tracking-tight leading-tight">
          {CONTENT.header.title.split(" ")[0]} <br /> 
          {CONTENT.header.title.split(" ")[1]}
        </h1>
        <p className="text-gray-500 dark:text-white text-lg md:text-xl leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
          {CONTENT.header.subtitle}
        </p>
      </header>

      {/* Cards grid */}
      <section 
        className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 w-full max-w-7xl"
        aria-label="Unidades disponíveis"
      >
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </section>

      {/* Help section */}
      <footer className="mt-20 w-full flex justify-center">
        <p className="text-sm text-gray-500 dark:text-white max-w-md text-center leading-relaxed">
          {CONTENT.help}
        </p>
      </footer>
    </div>
  )
}