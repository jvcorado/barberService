"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Instagram,
  LogOut,
  Home,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { signOutClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { BackgroundSync } from "@/components/background-sync";
import LinkAccountsDialog from "./link-accounts-dialog";

interface ClientLayoutProps {
  children: React.ReactNode;
  barbershop: any;
}

export default function ClientLayout({
  children,
  barbershop,
}: ClientLayoutProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && barbershop?.id) {
      router.push(`/client/login?id=${barbershop.id}`);
    }
  }, [status, router, barbershop?.id]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // No session state - mostrar loading enquanto redireciona
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Redirecionando...</h2>
          <p className="text-gray-300 mb-6">
            Você será redirecionado para o login
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* PWA Components */}
      <OfflineIndicator />
      <PWAInstallBanner />
      <BackgroundSync />

      {/* Menu Button */}
      <div className="fixed top-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-md border border-white/20"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-white/10"
          >
            <div className="flex flex-col h-full">
              <div className="space-y-6 flex-1">
                {/* Header do Sidebar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                </div>

                {/* Perfil do Usuário */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <span className="text-lg font-semibold">
                      {session?.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {session?.user?.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                {/* Navegação do Cliente */}
                <nav className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                    onClick={() => {
                      router.push(`/client?id=${barbershop.id}`);
                      setIsOpen(false);
                    }}
                  >
                    <Home className="h-4 w-4" />
                    Início
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 text-white hover:bg-white/10"
                    onClick={() => {
                      router.push(
                        `/barber_app/client/services?barbershopId=${barbershop.id}`,
                      );
                      setIsOpen(false);
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                    Agendar Serviço
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 text-white hover:bg-white/10"
                    onClick={() => {
                      router.push(
                        `/barber_app/client/bookings?barbershopId=${barbershop.id}`,
                      );
                      setIsOpen(false);
                    }}
                  >
                    <ClipboardList className="h-4 w-4" />
                    Meus Agendamentos
                  </Button>
                </nav>

                {/* Ações Rápidas */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    className="w-full gap-3 rounded-xl py-3 text-white border-white/20 hover:bg-white/10 transition-all duration-200"
                    onClick={() => {
                      if (barbershop.phones && barbershop.phones.length > 0) {
                        window.open(
                          `https://wa.me/${barbershop.phones[0].replace(/\D/g, "")}`,
                          "_blank",
                        );
                      }
                    }}
                    disabled={
                      !barbershop.phones || barbershop.phones.length === 0
                    }
                  >
                    <MessageCircle className="h-4 w-4" />
                    {barbershop.phones && barbershop.phones.length > 0
                      ? "WhatsApp"
                      : "Sem WhatsApp"}
                  </Button>

                  {/* Botão de Sair */}
                  <Button
                    variant="outline"
                    className="w-full gap-3 rounded-xl py-3 text-white border-white/20 hover:bg-white/10 transition-all duration-200"
                    onClick={async () => {
                      await signOutClient(barbershop.id);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
