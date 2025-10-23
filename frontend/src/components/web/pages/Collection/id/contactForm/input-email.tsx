import * as React from "react"
import { Mail } from "lucide-react"

import { cn } from "@/lib/utils"

function InputEmail({ className, ...props }: React.ComponentProps<"input">) {
  const [error, setError] = React.useState<string>("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)

  const validateEmail = (email: string) => {
    if (!email) {
      setError("")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido")
    } else {
      setError("")
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    validateEmail(e.target.value)
    props.onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    if (error) {
      validateEmail(e.target.value)
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
          E-mail 
        </label>
        <input
          type="email"
          data-slot="input"
          className={cn(
            "w-full rounded-lg border-gray-300  p-4 pe-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out transform focus:-translate-y-1 dark:text-white dark:bg-background",
          
            error && "border-destructive",
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

export { InputEmail }