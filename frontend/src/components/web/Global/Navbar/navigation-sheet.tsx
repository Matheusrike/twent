"use client"

import { Button } from "@/components/web/Global/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/web/Global/Navbar/sheet";
import { Menu } from "lucide-react";
import { NavMenu } from "./nav-menu";
import Link from "next/link";

// Navigation links import
import navigationLinks from './json/navigationLinksData.json' assert { type: "json" };

export const NavigationSheet = () => {
  return (
    <Sheet>
      {/* toggle button */}
      <SheetTrigger asChild>
        <Button variant="menu" size="menu" className="cursor-pointer">
          <Menu />
        </Button>
      </SheetTrigger>

      {/* content */}
      <SheetContent className="px-6 py-3 flex flex-col h-full" side="right">

        {/* nav main component */}
        <NavMenu orientation="vertical" className="flex-1 w-full h-full" />

        {/* Footer link */}

        <div className="w-full  border-t-[0.5px] border-black dark:border-white p-2 flex justify-center items-center  gap-5">
          {navigationLinks.footerLinks.map((link, i) => (
            <SheetClose key={i} asChild>
              <Link
                href={link.url}
                className="text-sm uppercase font-semibold text-black dark:text-white hover:underline cursor-pointer"
              >
                <span>{link.name}</span>
              </Link>
            </SheetClose>
          ))}
        </div>

        {/* Footer end */}
        <div className="w-full text-center text-sm font-semibold py-2">
          <h1 className="text-black dark:text-white">TWENT®</h1>
        </div>
      </SheetContent>
    </Sheet>
  );
};
