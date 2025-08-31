"use client";

import { useState } from "react";
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
  Link,
} from "lucide-react";
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
                    <Home className="h-4 w-4" />
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
                    <Calendar className="h-4 w-4" />
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
                    <ClipboardList className="h-4 w-4" />
                    Meus Agendamentos
                  </Button>

                  {/* Botão Vincular Conta */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                    onClick={() => {
                      // Abrir o dialog de vincular contas
                      setIsOpen(false);
                      // Aqui você pode adicionar lógica para abrir o dialog
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
                    <Link className="h-4 w-4" />
                    Vincular Conta
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
                    <MessageCircle className="h-4 w-4" />
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
