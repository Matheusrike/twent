import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const countries = [
  "Afeganistão", "África do Sul", "Albânia", "Alemanha", "Andorra", "Angola", "Antígua e Barbuda",
  "Arábia Saudita", "Argélia", "Argentina", "Armênia", "Austrália", "Áustria", "Azerbaijão",
  "Bahamas", "Bahrein", "Bangladesh", "Barbados", "Bielorrússia", "Bélgica", "Belize", "Benin",
  "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brasil", "Brunei", "Bulgária", "Burkina Faso",
  "Burundi", "Butão", "Cabo Verde", "Camarões", "Camboja", "Canadá", "Cazaquistão", "Catar",
  "Chade", "Chile", "China", "Chipre", "Colômbia", "Comores", "Congo", "Coreia do Norte",
  "Coreia do Sul", "Costa do Marfim", "Costa Rica", "Croácia", "Cuba", "Dinamarca", "Djibuti",
  "Dominica", "Egito", "El Salvador", "Emirados Árabes Unidos", "Equador", "Eritreia",
  "Eslováquia", "Eslovênia", "Espanha", "Estados Unidos", "Estônia", "Eswatini", "Etiópia",
  "Fiji", "Filipinas", "Finlândia", "França", "Gabão", "Gâmbia", "Gana", "Geórgia", "Granada",
  "Grécia", "Guatemala", "Guiana", "Guiné", "Guiné Equatorial", "Guiné-Bissau", "Haiti",
  "Holanda", "Honduras", "Hungria", "Iêmen", "Ilhas Marshall", "Ilhas Salomão", "Índia",
  "Indonésia", "Irã", "Iraque", "Irlanda", "Islândia", "Israel", "Itália", "Jamaica", "Japão",
  "Jordânia", "Kuwait", "Laos", "Lesoto", "Letônia", "Líbano", "Libéria", "Líbia",
  "Liechtenstein", "Lituânia", "Luxemburgo", "Macedônia do Norte", "Madagascar", "Malásia",
  "Malawi", "Maldivas", "Mali", "Malta", "Marrocos", "Maurício", "Mauritânia", "México",
  "Mianmar", "Micronésia", "Moçambique", "Moldávia", "Mônaco", "Mongólia", "Montenegro",
  "Namíbia", "Nauru", "Nepal", "Nicarágua", "Níger", "Nigéria", "Noruega", "Nova Zelândia",
  "Omã", "Palau", "Palestina", "Panamá", "Papua-Nova Guiné", "Paquistão", "Paraguai", "Peru",
  "Polônia", "Portugal", "Quênia", "Quirguistão", "Reino Unido", "República Centro-Africana",
  "República Dominicana", "República Tcheca", "Romênia", "Ruanda", "Rússia", "Samoa",
  "San Marino", "Santa Lúcia", "São Cristóvão e Névis", "São Tomé e Príncipe",
  "São Vicente e Granadinas", "Seychelles", "Senegal", "Serra Leoa", "Sérvia", "Singapura",
  "Síria", "Somália", "Sri Lanka", "Sudão", "Sudão do Sul", "Suécia", "Suíça", "Suriname",
  "Tailândia", "Taiwan", "Tajiquistão", "Tanzânia", "Timor-Leste", "Togo", "Tonga",
  "Trinidad e Tobago", "Tunísia", "Turcomenistão", "Turquia", "Tuvalu", "Ucrânia", "Uganda",
  "Uruguai", "Uzbequistão", "Vanuatu", "Vaticano", "Venezuela", "Vietnã", "Zâmbia", "Zimbábue"
]

function InputCountry({ className, ...props }: React.ComponentProps<"select">) {
  const [error, setError] = React.useState<string>("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)


  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false)
    
    props.onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasValue(e.target.value.length > 0)
    if (error && e.target.value) setError("")
    props.onChange?.(e)
  }

  const isLabelFloating = isFocused || hasValue

  return (
    <div className="w-full">
      <div className="relative">
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 ease-out pointer-events-none text-black",
            isLabelFloating
              ? "-top-2.5 text-xs bg-gray-200 px-1"
              : "top-1/2 -translate-y-1/2 text-base"
          )}
        >
          País/Região *
        </label>
        <select
          data-slot="input"
          className={cn(
            "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 border bg-gray-200 pl-4 pr-10 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            error && "border-destructive",
            className
          )}
          aria-invalid={!!error}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={handleChange}
          defaultValue=""
          {...props}
        >
          <option value="" disabled style={{ display: 'none' }}></option>
          {countries.map((c) => <option key={c} value={c} className="text-base text-black">{c}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
      </div>
      {error && <p className="text-destructive text-xs mt-1.5 ml-0.5">{error}</p>}
    </div>
  )
}

export { InputCountry }