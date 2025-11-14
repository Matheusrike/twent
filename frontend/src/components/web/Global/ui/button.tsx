import * as React from "react"
import { Slot as SlotPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          " hover:text-accent-foreground font-semibold ",
        link: "text-primary underline-offset-4 hover:underline",
        // header and sidebar buttons
        menu: "hover:bg-accent hover:text-accent-foreground dark:text-white ",
        search: "text-black dark:text-white cursor-pointer hidden md:flex",
        languageButton: 'text-black dark:text-white bg-transparent cursor-pointer border-none hover:border-none hover:bg-accent hover:text-accent-foreground dark:text-white p-2',
        setLanguageButton: 'bg-transparent hover:bg-accent hover:text-accent-foreground dark:text-white justify-between cursor-pointer',
        // standart button
        standartButton: `
        relative bottom-0 flex justify-center items-center gap-2 cursor-pointer
        border-none
        rounded-xl 
        text-primary-foreground font-black uppercase 
        px-8 py-4 z-10 overflow-hidden 
        ease-in-out duration-700 group 
        bg-primary 
        hover:bg-black hover:text-white
        dark:hover:bg-white dark:hover:text-black
        active:scale-95 active:duration-0 
        focus:bg-white focus:text-black 
        isolation-auto 
        before:absolute before:w-full before:transition-all before:duration-700 
        before:hover:w-full before:-left-full before:hover:left-0 
        before:rounded-full before:bg-white 
        before:-z-10 before:aspect-square 
        before:hover:scale-150 before:hover:duration-700
      `,
        // use only when light mode has a black background
        standartButtonDark: `
        relative bottom-0 flex justify-center items-center gap-2 cursor-pointer
        border-none
        rounded-xl 
        text-primary-foreground font-black uppercase 
        px-8 py-4 z-10 overflow-hidden 
        ease-in-out duration-700 group 
        bg-primary 
        hover:bg-white hover:text-black
      
        active:scale-95 active:duration-0 
        isolation-auto 
        before:absolute before:w-full before:transition-all before:duration-700 
        before:hover:w-full before:-left-full before:hover:left-0 
        before:rounded-full before:bg-white 
        before:-z-10 before:aspect-square 
        before:hover:scale-150 before:hover:duration-700 
        dark:before:bg-[var(--dark-hover)]
      `,
        // map mobile button
        mapButton: "bg-primary text-white cursor-pointer",


      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        menu: "h-10 rounded-md px-6 has-[>svg]:px-3",
        headericon: "rounded-full px-6 has-[>svg]:p-2 text-6xl",
        search: "text-sm p-2",
        languageButton: 'text-sm',
        setLanguageButton: '',
        standartButton: `
        h-10 rounded-md px-6 has-[>svg]:px-4 
        w-full mt-10 
        sm:w-auto sm:mt-0
        
      `,
      mapButton: "h-8 rounded-md px-6 has-[>svg]:px-3",

      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
