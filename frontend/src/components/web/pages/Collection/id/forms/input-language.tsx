import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const languages = [
  "Português", "Inglês", "Espanhol", "Francês", "Alemão", "Italiano", "Japonês", "Chinês", 
  "Coreano", "Russo", "Árabe", "Holandês", "Sueco", "Norueguês", "Dinamarquês", 
  "Finlandês", "Polonês", "Turco", "Grego", "Tailandês", "Vietnamita", 
  "Indonésio", "Malaio", "Filipino", "Ucraniano", "Romeno", "Tcheco", "Húngaro", 
  "Búlgaro", "Croata", "Sérvio", "Eslovaco", "Esloveno"
]

function InputLanguage({ className, ...props }: React.ComponentProps<"select">) {
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
            "placeholder:text-black placeholder:text-base selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 border bg-gray-200 pl-4 pr-10 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
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
          {languages.map((l) => <option key={l} value={l} className="text-base">{l}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
      </div>
      {error && <p className="text-destructive text-xs mt-1.5 ml-0.5">{error}</p>}
    </div>
  )
}

export { InputLanguage }