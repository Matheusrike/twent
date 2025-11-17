import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-lg  border-gray-300  p-4 pe-12 text-sm shadow-sm  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out transform focus:-translate-y-1",
        className
      )}
      {...props}
    />
  )
}

export { Input }
