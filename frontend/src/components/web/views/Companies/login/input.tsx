import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 backdrop-blur-sm p-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500",
 
        "shadow-sm transition-none",


        "focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30",

        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Input }
