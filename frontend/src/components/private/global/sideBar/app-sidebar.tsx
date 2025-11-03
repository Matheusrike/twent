"use client"

import * as React from "react"
import {
  IconLayoutDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers,
  IconSettings,
  IconGlobe,
  IconHelp,
  IconSparkles,
} from "@tabler/icons-react"

import { Container } from "lucide-react"

import { NavUser } from "@/components/private/global/sideBar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

const Matrizdata = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/matriz/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Filiais",
      url: "/matriz/filiais",
      icon: IconGlobe,
    },
    {
      title: "Financeiro",
      url: "/matriz/financeiro",
      icon: IconChartBar,
    },
    {
      title: "Estoque",
      url: "/matriz/estoque",
      icon: Container,
    },
    {
      title: "Colaboradores",
      url: "/matriz/colaboradores",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Ajuda",
      url: "#",
      icon: IconHelp,
    },
   
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState<string>("Dashboard")

  return (
    <Sidebar collapsible="offcanvas" className="border-r" {...props}>
      {/* Header */}
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
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {Matrizdata.navMain.map((item) => {
                const isActive = activeItem === item.title
                const Icon = item.icon
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link 
                      href={item.url} 
                      className="block w-full"
                      onClick={() => setActiveItem(item.title)}
                    >
                      <div
                        className={`
                          group relative flex items-center gap-3 rounded-lg px-3 py-2.5 
                          transition-all duration-200 ease-out
                          ${isActive 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }
                        `}
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
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Suport
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {Matrizdata.navSecondary.map((item) => {
                const Icon = item.icon
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <a href={item.url} className="block w-full">
                      <div className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 font-medium text-sm">
                          {item.title}
                        </span>
                      </div>
                    </a>
                  </SidebarMenuItem>
                  
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <NavUser user={Matrizdata.user} />
      </SidebarFooter>
    </Sidebar>
  )
}