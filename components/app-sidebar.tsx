"use client";

import * as React from "react";
import {
  BarChartIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
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
      title: "Serviços",
      url: "/dashboard/services",
      icon: ListIcon,
    },
    {
      title: "Agendamentos",
      url: "/dashboard/bookings",
      icon: BarChartIcon,
    },
  ],

  navSecondary: [
    {
      title: "Ajuda",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useSession();

  console.log(data);

  return (
    <Sidebar className="bg-background" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5  flex flex-col items-start p-0 h-13"
            >
              <Link href="/" className="">
                <p className="text-primary text-start text-lg">reserva</p>
                <p className="-mt-5 text-lg text-start">agora.com</p>
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
