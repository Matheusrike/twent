"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"


import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <Link href={item.url} key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  className="cursor-pointer group transition-all duration-200 hover:bg-accent/50 rounded-lg"
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    <span className="font-semibold text-sm group-hover:translate-x-1 transition-transform duration-200">
                      {item.title}
                    </span>
                    {item.icon && (
                      <item.icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200 hover:text-primary" />
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
