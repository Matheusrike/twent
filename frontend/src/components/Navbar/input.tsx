import * as React from "react"
import { IoSearchOutline } from "react-icons/io5";

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative group hidden md:flex gap-1 items-center justify-center">
      <IoSearchOutline size={20} className="text-black dark:text-white" />
      <div className="relative group w-auto flex items-center">
     
        {/* Input */}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "bg-transparent border-none outline-none text-black dark:text-white placeholder:text-black dark:placeholder:text-white caret-black dark:caret-white text-sm",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />

        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black dark:bg-white transition-all duration-300 group-focus-within:w-full "></span>
      </div>


    </div>
  )
}

export { Input }
