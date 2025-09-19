import * as React from "react"
import { IoSearchOutline } from "react-icons/io5";

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative group hidden md:flex gap-1 items-center justify-center">
    <IoSearchOutline size={20} className="text-black dark:text-white" />
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-25 bg-transparent border-none outline-none text-black dark:text-white placeholder:text-black dark:placeholder:text-white caret-black dark:caret-white",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm hover-line",
        className
      )}
      {...props}
    />
  </div>
  )
}

export { Input }
