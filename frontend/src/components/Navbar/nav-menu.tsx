import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/Navbar/navigation-menu";
import Link from "next/link";
import { ComponentProps } from "react";
import { ChevronRight } from "lucide-react";

// Navigation links import
import navigationLinks from './json/navigationLinks.json' assert { type: "json" };

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="h-full gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start dark:text-white">
      {/*  Navigation links */}
      <NavigationMenuItem>
        {navigationLinks.map((link, i) => (
          <NavigationMenuLink key={i} asChild>

            {/* Link */}
            <Link
              href={link.url}
              className="relative group/item flex items-center pl-8 pr-6 py-5 font-extralight text-sm tracking-[0.15em] text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] 
      before:absolute before:left-0 before:top-1/2 before:h-1/2 before:w-1 before:bg-gradient-to-b before:from-black before:to-slate-800 dark:before:from-white dark:before:to-slate-200 
      before:transform before:-translate-y-1/2 before:scale-y-100 before:transition-transform before:duration-500 before:ease-out 
      hover:before:scale-y-150 hover:bg-gradient-to-r hover:from-transparent hover:to-transparent dark:hover:bg-transparent"
            >
              {/* Page name */}
              <span className="font-semibold relative z-10 transform transition-all duration-300 group-hover/item:translate-x-2 group-hover/item:tracking-[0.2em]">
                {link.name}
              </span>
              {/* Icon */}
              <div className="ml-auto pl-8 opacity-0 translate-x-3 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0">
                <ChevronRight className="w-4 h-4 text-black dark:text-white" />
              </div>
            </Link>
          </NavigationMenuLink>
        ))}
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
