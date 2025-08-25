"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Settings, X, Phone, MessageCircle, Palette } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { BackgroundSync } from "@/components/background-sync";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";

interface BarberAppLayoutProps {
  children: React.ReactNode;
  barbershop: any;
}

export default function BarberAppLayout({
  children,
  barbershop,
}: BarberAppLayoutProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { colors } = useBarbershopColors();

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.primaryColor }}
            ></div>
            <p style={{ color: colors.textColor }}>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // No session state
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4" style={{ color: colors.textColor }}>
              Você precisa estar logado para acessar o app
            </p>
            <Button onClick={() => router.push("/api/auth/signin")}>
              Entrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.backgroundColor }}
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
                backgroundColor: `${colors.secondaryColor}90`,
                color: colors.primaryColor,
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px]"
            style={{
              backgroundColor: colors.secondaryColor,
              color: colors.textColor,
            }}
          >
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-6 flex-1">
                {/* Header do Sidebar */}
                <div className="flex items-center justify-between border-b pb-4">
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: colors.primaryColor,
                    }}
                  >
                    {barbershop.name}
                  </h2>
                </div>

                {/* Perfil do Usuário */}
                <div className="flex items-center gap-3 border-b pb-4">
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
                        color: colors.primaryColor,
                      }}
                    >
                      {session?.user?.name}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: colors.textColor,
                      }}
                    >
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                {/* Informações da Barbearia */}
                {/* <div
                  className="space-y-3 border-b pb-4"
                  style={{
                    borderColor: colors.primaryColor,
                  }}
                >
                  <h3
                    className="font-semibold"
                    style={{
                      color: colors.primaryColor,
                    }}
                  >
                    {barbershop.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: colors.textColor,
                    }}
                  >
                    {barbershop.address}
                  </p>
                </div> */}

                {/* Navegação */}
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push("/dashboard");
                      setIsOpen(false);
                    }}
                    style={{
                      color: colors.textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.primaryColor;
                      e.currentTarget.style.color = colors.secondaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.textColor;
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Dashboard Web
                  </Button>

                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium"
                    onClick={() => {
                      router.push("/barber_app");
                      setIsOpen(false);
                    }}
                    style={{
                      backgroundColor: colors.primaryColor,
                      color: colors.secondaryColor,
                    }}
                  >
                    <Menu className="h-4 w-4" />
                    App do Barbeiro
                  </Button> */}

                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push(`/barber_app/client?id=${barbershop.id}`);
                      setIsOpen(false);
                    }}
                    style={{
                      color: colors.textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.primaryColor;
                      e.currentTarget.style.color = colors.secondaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.textColor;
                    }}
                  >
                    App do Cliente
                  </Button> */}

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push("/barber_app/config");
                      setIsOpen(false);
                    }}
                    style={{
                      color: colors.textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.primaryColor;
                      e.currentTarget.style.color = colors.secondaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.textColor;
                    }}
                  >
                    <Palette className="h-4 w-4" />
                    Configurações
                  </Button>
                </nav>

                {/* Ações Rápidas */}
                {/* <div
                  className="space-y-2 pt-4 border-t"
                  style={{
                    borderColor: colors.primaryColor,
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
                      borderColor: colors.primaryColor,
                      color: colors.primaryColor,
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
                          "_blank"
                        );
                      }
                    }}
                    disabled={
                      !barbershop.phones || barbershop.phones.length === 0
                    }
                    style={{
                      borderColor: colors.primaryColor,
                      color: colors.primaryColor,
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {barbershop.phones && barbershop.phones.length > 0
                      ? "WhatsApp"
                      : "Sem WhatsApp"}
                  </Button>
                </div> */}
              </div>
              {/* Footer do Sidebar */}
              <div
                className="pt-4 border-t mt-auto"
                style={{
                  borderColor: colors.primaryColor,
                }}
              >
                <div
                  className="text-center text-xs"
                  style={{
                    color: colors.textColor,
                  }}
                >
                  <p>App do Barbeiro</p>
                  <p>v1.0.0</p>
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
