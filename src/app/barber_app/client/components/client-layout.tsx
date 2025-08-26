"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MessageCircle, Instagram, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
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
              className="animate-spin rounded-2xl h-8 w-8 border-b-2 mx-auto mb-4"
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
      <div className="fixed top-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-14 w-14 touch-button backdrop-blur shadow-xl rounded-2xl transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: `${barbershop.secondaryColor || "#ffffff"}98`,
                color: barbershop.primaryColor || "#000000",
                border: `2px solid ${barbershop.primaryColor || "#000000"}30`,
                boxShadow: `0 8px 32px ${barbershop.primaryColor || "#000000"}20`,
              }}
            >
              <Menu className="h-7 w-7" />
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
                    Menu
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
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: barbershop.primaryColor || "#000000",
                      color: barbershop.secondaryColor || "#ffffff",
                    }}
                  >
                    <span className="text-lg font-semibold">
                      {session?.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
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
                <nav className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push(`/barber_app/client?id=${barbershop.id}`);
                      setIsOpen(false);
                    }}
                    style={{
                      backgroundColor: barbershop.primaryColor || "#000000",
                      color: barbershop.secondaryColor || "#ffffff",
                    }}
                  >
                    <span className="text-lg">🏠</span>
                    Início
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push(
                        `/barber_app/client/book?barbershopId=${barbershop.id}`,
                      );
                      setIsOpen(false);
                    }}
                    style={{
                      color: barbershop.textColor || "#111827",
                      backgroundColor: "transparent",
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
                    <span className="text-lg">📅</span>
                    Agendar Serviço
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push(`/barber_app/client?id=${barbershop.id}`);
                      setIsOpen(false);
                    }}
                    style={{
                      color: barbershop.textColor || "#111827",
                      backgroundColor: "transparent",
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
                    <span className="text-lg">📋</span>
                    Meus Agendamentos
                  </Button>
                </nav>

                {/* Ações Rápidas */}
                <div
                  className="space-y-3 pt-4 border-t"
                  style={{
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full gap-3 rounded-xl py-3"
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
                      backgroundColor: barbershop.secondaryColor || "#ffffff",
                    }}
                  >
                    <span className="text-lg">📞</span>
                    {barbershop.phones && barbershop.phones.length > 0
                      ? "Ligar"
                      : "Sem telefone"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-3 rounded-xl py-3"
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
                      backgroundColor: barbershop.secondaryColor || "#ffffff",
                    }}
                  >
                    <span className="text-lg">💬</span>
                    {barbershop.phones && barbershop.phones.length > 0
                      ? "WhatsApp"
                      : "Sem WhatsApp"}
                  </Button>

                  {/* Botão de Sair */}
                  <Button
                    variant="outline"
                    className="w-full gap-3 rounded-xl py-3"
                    onClick={() => signOut()}
                    style={{
                      borderColor: barbershop.primaryColor || "#000000",
                      color: barbershop.primaryColor || "#000000",
                      backgroundColor: barbershop.secondaryColor || "#ffffff",
                    }}
                  >
                    <span className="text-lg">🚪</span>
                    Sair
                  </Button>
                </div>

                {/* Footer do Sidebar */}
                <div
                  className="pt-6 border-t mt-auto"
                  style={{
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  <div
                    className="text-center text-xs space-y-1 mb-4"
                    style={{
                      color: barbershop.textColor || "#111827",
                    }}
                  >
                    <p>Cliente</p>
                    <p>v1.0.0</p>
                  </div>

                  {/* Botão para vincular contas */}
                  <div className="flex justify-center">
                    <LinkAccountsDialog barbershopId={barbershop.id} />
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
