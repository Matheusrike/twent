"use client";

import {
  IconLogout,
  IconUserCircle,
  IconChevronRight,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group hover:bg-accent transition-all duration-200 data-[state=open]:bg-accent"
            >
              <Avatar className="h-9 w-9 rounded-full border-none transition-all duration-200 ">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col text-left">
                <span className="truncate font-semibold text-sm">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <IconChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-xl shadow-lg border"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-t-xl">
                <Avatar className="h-12 w-12 rounded-full border-none shadow-sm">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white font-semibold text-base">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col min-w-0">
                  <span className="truncate font-semibold text-sm">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <div className="p-1">

              <Link href="/matriz/profile">
                <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 transition-colors">
                  <IconUserCircle className="h-4 w-4" />
                  <span className="font-medium"> Minha Conta</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 transition-colors">
                <IconLogout className="h-4 w-4" />
                <span className="font-medium">Sair</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
