import * as React from "react"
import { Phone } from "lucide-react"

import { cn } from "@/lib/utils"

function InputPhone({ className, ...props }: React.ComponentProps<"input">) {
  const [error, setError] = React.useState<string>("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)

  const formatPhone = (value: string) => {
    
    const numbers = value.replace(/\D/g, "")
    
    
    if (numbers.length <= 10) {
      
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, p1, p2, p3) => {
        if (p3) return `(${p1}) ${p2}-${p3}`
        if (p2) return `(${p1}) ${p2}`
        if (p1) return `(${p1}`
        return numbers
      })
    } else {
      
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, p1, p2, p3) => {
        if (p3) return `(${p1}) ${p2}-${p3}`
        if (p2) return `(${p1}) ${p2}`
        return numbers
      })
    }
  }

  const validatePhone = (phone: string) => {
    if (!phone) {
      setError("")
      return
    }

    const numbers = phone.replace(/\D/g, "")
    if (numbers.length < 10) {
      setError("Por favor, insira um telefone válido")
    } else {
      setError("")
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    validatePhone(e.target.value)
    props.onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    e.target.value = formatted
    setHasValue(formatted.length > 0)
    if (error) {
      validatePhone(formatted)
    }
    props.onChange?.(e)
  }

  const isLabelFloating = isFocused || hasValue

  return (
    <div className="w-full">
      <div className="relative">
      <label
          className={cn(
            "absolute left-4 text-muted-foreground transition-all duration-200 ease-out pointer-events-none ",
            isLabelFloating
              ? "-top-7 text-xs px-1"
              : "top-1/2 -translate-y-1/2 text-base"
          )}
        >
          Telefone 
        </label>
        <input
          type="tel"
          data-slot="input"
          maxLength={15}
          className={cn(
            "w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out transform focus:-translate-y-1 dark:text-white dark:bg-background",
            error && "border-destructive",
            className
          )}
          aria-invalid={!!error}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={handleChange}
          {...props}
        />
      </div>
      {error && (
        <p className="text-destructive text-xs mt-1.5 ml-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

export { InputPhone }