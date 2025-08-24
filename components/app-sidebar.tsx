"use client";

import * as React from "react";
import {
  BarChartIcon,
  CalendarIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOutIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
  UserIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";

const datas = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Agenda",
      url: "/dashboard/bookings",
      icon: CalendarIcon,
    },
    {
      title: "Clientes",
      url: "/dashboard/customers",
      icon: UsersIcon,
    },
    {
      title: "Barbeiros",
      url: "/dashboard/stylists",
      icon: UserIcon,
    },
    {
      title: "Produtos",
      url: "/dashboard/products",
      icon: PackageIcon,
    },
    {
      title: "Relatórios",
      url: "/dashboard/reports",
      icon: BarChartIcon,
    },
    {
      title: "Configurações",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ],

  navSecondary: [
    {
      title: "Sair",
      url: "/api/auth/signout",
      icon: LogOutIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useSession();

  return (
    <Sidebar className="bg-background" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 flex flex-col items-start p-0 h-13"
            >
              <Link href="/" className="">
                <p className="text-primary text-start text-lg font-bold">
                  BARBERS
                </p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={datas.navMain} />
        <NavSecondary items={datas.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: data?.user.name ?? "Usuário",
            email: data?.user.email ?? "sem-email",
            avatar: data?.user.image ?? "",
            barbershopId: data?.user.barbershop?.id ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
