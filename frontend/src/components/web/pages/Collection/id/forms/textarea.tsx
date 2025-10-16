import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const [error, setError] = React.useState<string>("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)

  const validateText = (text: string) => {
    if (!text) {
      setError("")
      return
    }

    if (text.trim().length < 10) {
      setError("Por favor, insira pelo menos 10 caracteres")
    } else {
      setError("")
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    validateText(e.target.value)
    props.onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0)
    if (error) {
      validateText(e.target.value)
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
              : "top-4 text-base"
          )}
        >
          Mensagem *
        </label>
        <textarea
          data-slot="textarea"
          className={cn(
            "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-32 w-full border bg-gray-200 px-4 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] h-40 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
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

export { Textarea }