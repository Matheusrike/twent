"use client";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { renameTitleFn } from "@/utils/functions/renameSideBarHeader";

export function SiteHeader() {
  const pathname = usePathname();
  const pageName = pathname.split("/").filter(Boolean).pop() || "Home";
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return (
    <header className="relative flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[var(--header-height)] overflow-hidden">
      {/* Onda Vermelha Animada */}
      <div className="absolute  top-0 bottom-0 w-full pointer-events-none">
        <svg
          className="absolute  h-full w-full"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(220, 38, 38)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(185, 28, 28)" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          
          <path
            d="M400,50 Q350,20 300,50 T200,50 T100,50 T0,50 L0,100 L400,100 Z"
            fill="url(#waveGradient)"
          >
            <animate
              attributeName="d"
              dur="3s"
              repeatCount="indefinite"
              values="
                M400,50 Q350,20 300,50 T200,50 T100,50 T0,50 L0,100 L400,100 Z;
                M400,50 Q350,80 300,50 T200,50 T100,50 T0,50 L0,100 L400,100 Z;
                M400,50 Q350,20 300,50 T200,50 T100,50 T0,50 L0,100 L400,100 Z
              "
            />
          </path>
          
          <path
            d="M400,60 Q350,30 300,60 T200,60 T100,60 T0,60 L0,100 L400,100 Z"
            fill="url(#waveGradient)"
            opacity="0.6"
          >
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M400,60 Q350,30 300,60 T200,60 T100,60 T0,60 L0,100 L400,100 Z;
                M400,60 Q350,90 300,60 T200,60 T100,60 T0,60 L0,100 L400,100 Z;
                M400,60 Q350,30 300,60 T200,60 T100,60 T0,60 L0,100 L400,100 Z
              "
            />
          </path>
        </svg>
      </div>

      <div className="relative z-10 flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-lg uppercase font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {renameTitleFn(title)}
        </h1>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
}