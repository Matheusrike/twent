import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/Navbar/sheet";
import { Menu } from "lucide-react";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="menu" size="menu" className="cursor-pointer" >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-6 py-3" side="right">
        {/* links */}
        <NavMenu orientation="vertical" className=" [&>div]:h-full " />
        {/* menu footer */}
        <div className="w-full text-center text-sm font-semibold">
          <h1 className="text-black dark:text-white">TWENT®</h1>
        </div>
      </SheetContent>
    </Sheet>
  );
};
