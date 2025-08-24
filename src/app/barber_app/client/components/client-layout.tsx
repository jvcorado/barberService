"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { BackgroundSync } from "@/components/background-sync";

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

  // Loading state
  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: barbershop.backgroundColor || "#f9fafb" }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ borderColor: barbershop.primaryColor || "#000000" }}
            ></div>
            <p style={{ color: barbershop.textColor || "#111827" }}>
              Carregando...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No session state
  if (status === "unauthenticated") {
    router.push(`/barber_app/client/login?id=${barbershop.id}`);
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: barbershop.backgroundColor || "#f9fafb" }}
    >
      {/* PWA Components */}
      <OfflineIndicator />
      <PWAInstallBanner />
      <BackgroundSync />

      {/* Menu Button */}
      <div className="fixed top-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 touch-button backdrop-blur shadow-lg"
              style={{
                backgroundColor: `${barbershop.secondaryColor || "#ffffff"}90`,
                color: barbershop.primaryColor || "#000000",
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px]"
            style={{
              backgroundColor: barbershop.secondaryColor || "#ffffff",
              color: barbershop.textColor || "#111827",
            }}
          >
            <div className="flex flex-col h-full">
              <div className="space-y-6 flex-1">
                {/* Header do Sidebar */}
                <div
                  className="flex items-center justify-between border-b pb-4"
                  style={{
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: barbershop.primaryColor || "#000000",
                    }}
                  >
                    Menu do Cliente
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                    style={{
                      color: barbershop.primaryColor || "#000000",
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Perfil do Usuário */}
                <div
                  className="flex items-center gap-3 border-b pb-4"
                  style={{
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      className="font-medium"
                      style={{
                        color: barbershop.primaryColor || "#000000",
                      }}
                    >
                      {session?.user?.name}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: barbershop.textColor || "#111827",
                      }}
                    >
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                {/* Informações da Barbearia */}
                <div
                  className="space-y-3 border-b pb-4"
                  style={{
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  <h3
                    className="font-semibold"
                    style={{
                      color: barbershop.primaryColor || "#000000",
                    }}
                  >
                    {barbershop.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: barbershop.textColor || "#111827",
                    }}
                  >
                    {barbershop.address}
                  </p>
                </div>

                {/* Navegação do Cliente */}
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push(`/barber_app/client?id=${barbershop.id}`);
                      setIsOpen(false);
                    }}
                    style={{
                      backgroundColor: barbershop.primaryColor || "#000000",
                      color: barbershop.secondaryColor || "#ffffff",
                    }}
                  >
                    🏠 Início
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push(
                        `/barber_app/client/book?barbershopId=${barbershop.id}`,
                      );
                      setIsOpen(false);
                    }}
                    style={{
                      color: barbershop.textColor || "#111827",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        barbershop.primaryColor || "#000000";
                      e.currentTarget.style.color =
                        barbershop.secondaryColor || "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        barbershop.textColor || "#111827";
                    }}
                  >
                    📅 Agendar Serviço
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push(`/barber_app/client?id=${barbershop.id}`);
                      setIsOpen(false);
                    }}
                    style={{
                      color: barbershop.textColor || "#111827",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        barbershop.primaryColor || "#000000";
                      e.currentTarget.style.color =
                        barbershop.secondaryColor || "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        barbershop.textColor || "#111827";
                    }}
                  >
                    📋 Meus Agendamentos
                  </Button>
                </nav>

                {/* Ações Rápidas */}
                <div
                  className="space-y-2 pt-4 border-t"
                  style={{
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      if (barbershop.phones && barbershop.phones.length > 0) {
                        window.open(`tel:${barbershop.phones[0]}`, "_self");
                      }
                    }}
                    disabled={
                      !barbershop.phones || barbershop.phones.length === 0
                    }
                    style={{
                      borderColor: barbershop.primaryColor || "#000000",
                      color: barbershop.primaryColor || "#000000",
                    }}
                  >
                    <Phone className="h-4 w-4" />
                    {barbershop.phones && barbershop.phones.length > 0
                      ? "Ligar"
                      : "Sem telefone"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
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
                    style={{
                      borderColor: barbershop.primaryColor || "#000000",
                      color: barbershop.primaryColor || "#000000",
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {barbershop.phones && barbershop.phones.length > 0
                      ? "WhatsApp"
                      : "Sem WhatsApp"}
                  </Button>
                </div>

                {/* Footer do Sidebar */}
                <div
                  className="pt-4 border-t mt-auto"
                  style={{
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  <div
                    className="text-center text-xs"
                    style={{
                      color: barbershop.textColor || "#111827",
                    }}
                  >
                    <p>App do Cliente</p>
                    <p>v1.0.0</p>
                  </div>
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
