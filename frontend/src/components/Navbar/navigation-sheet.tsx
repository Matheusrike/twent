import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/Navbar/sheet";
import { Menu } from "lucide-react";
import {LogoMenu } from "./logo";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="menu" size="menu" className="cursor-pointer" >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-6 py-3 " side="right">
        <LogoMenu />
        <NavMenu orientation="vertical" className="mt-6 [&>div]:h-full" />
      </SheetContent>
    </Sheet>
  );
};
