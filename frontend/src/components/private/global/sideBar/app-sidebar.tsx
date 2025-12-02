"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconChartBar,
  IconGlobe,
  IconUsers,
  IconHelp,
  IconShoppingCart,
  IconDeviceWatch
} from "@tabler/icons-react";
import { Container } from "lucide-react";
import { NavUser } from "@/components/private/global/sideBar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type RoleName = "ADMIN" | "MANAGER_BRANCH" | "EMPLOYEE_BRANCH" | string;

interface UserRoleResponse {
  data?: {
    user_roles?: {
      role?: {
        name?: RoleName;
      };
    }[];
  };
}

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);
  const [navMain, setNavMain] = React.useState<MenuItem[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  React.useEffect(() => {
    setIsClient(true);

    const fetchRole = async () => {
      try {
        const res = await fetch("/response/api/user/me", {
          method: "GET",
          credentials: "include",
        });

        const json: UserRoleResponse = await res.json();
        const role: RoleName | undefined =
          json.data?.user_roles?.[0]?.role?.name;

        let menu: MenuItem[] = [];

        if (role === "ADMIN") {
          menu = [
            { title: "Dashboard", url: "/private/dashboard", icon: IconLayoutDashboard },
            { title: "Filiais", url: "/private/branches", icon: IconGlobe },
            { title: "Financeiro", url: "/private/financial", icon: IconChartBar },
            { title: "Estoque", url: "/private/inventory", icon: Container },
            { title: "Coleção", url: "/private/collection", icon: IconDeviceWatch },
            { title: "Colaboradores", url: "/private/team", icon: IconUsers },
          ];
        } else if (role === "MANAGER_BRANCH") {
          menu = [
            { title: "Venda Rápida", url: "/private/pdv", icon: IconShoppingCart },
            { title: "Estoque", url: "/private/inventory", icon: Container },
            { title: "Colaboradores", url: "/private/team", icon: IconUsers },
          ];
        } else {
          menu = [
            { title: "Venda Rápida", url: "/private/pdv", icon: IconShoppingCart },
          ];
        }

        setNavMain(menu);
      } catch (error) {
        console.error("Erro ao buscar role:", error);
      }
    };

    fetchRole();
  }, []);

  React.useEffect(() => {
    const index = navMain.findIndex(item => item.url === pathname);
    setActiveIndex(index);
  }, [pathname, navMain]);

  if (!isClient) return null;

  return (
    <Sidebar collapsible="offcanvas" className="border-r" {...props}>
      <SidebarHeader className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden">
            <Image
              src="/img/global/light/faviconLight.svg"
              width={60}
              height={60}
              alt="Matriz Logo"
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Matriz</h2>
            <p className="text-xs text-muted-foreground">Gerenciador</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1 relative">
              {activeIndex >= 0 && (
                <div
                  className="absolute left-0 right-0 h-[42px] bg-primary rounded-lg transition-all duration-300 ease-out"
                  style={{
                    top: `${activeIndex * 44}px`,
                  }}
                />
              )}
              
              {navMain.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title} className="relative z-10 ">
                    <Link href={item.url} className="block  w-full">
                      <div
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 font-medium text-sm">
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Suporte
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <a
                  href="#"
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                  <IconHelp className="h-5 w-5 shrink-0" />
                  <span className="flex-1 font-medium text-sm">Ajuda</span>
                </a>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <NavUser
          user={{
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}