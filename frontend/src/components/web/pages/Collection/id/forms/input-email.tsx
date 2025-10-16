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
            "absolute left-4 transition-all duration-200 ease-out pointer-events-none text-black",
            isLabelFloating
              ? "-top-2.5 text-xs bg-gray-200 px-1"
              : "top-1/2 -translate-y-1/2 text-base"
          )}
        >
          E-mail *
        </label>
        <input
          type="email"
          data-slot="input"
          className={cn(
            "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 border bg-gray-200 pl-4 pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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