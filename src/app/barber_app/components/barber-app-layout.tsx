"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Settings, X, Phone, MessageCircle, Palette } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";

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

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // No session state
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Menu Button */}
      <div className="fixed top-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 touch-button backdrop-blur shadow-lg"
              style={{
                backgroundColor: `${(barbershop as any).secondaryColor || "#ffffff"}90`,
                color: (barbershop as any).primaryColor || "#000000",
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px]"
            style={{
              backgroundColor: (barbershop as any).secondaryColor || "#ffffff",
              color: (barbershop as any).textColor || "#111827",
            }}
          >
            <div className="flex flex-col h-full">
              <div className="space-y-6 flex-1">
                {/* Header do Sidebar */}
                <div
                  className="flex items-center justify-between border-b pb-4"
                  style={{
                    borderColor: (barbershop as any).primaryColor || "#000000",
                  }}
                >
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: (barbershop as any).primaryColor || "#000000",
                    }}
                  >
                    {barbershop.name}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                    style={{
                      color: (barbershop as any).primaryColor || "#000000",
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Perfil do Usuário */}
                <div
                  className="flex items-center gap-3 border-b pb-4"
                  style={{
                    borderColor: (barbershop as any).primaryColor || "#000000",
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
                        color: (barbershop as any).primaryColor || "#000000",
                      }}
                    >
                      {session?.user?.name}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: (barbershop as any).textColor || "#111827",
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
                    borderColor: (barbershop as any).primaryColor || "#000000",
                  }}
                >
                  <h3
                    className="font-semibold"
                    style={{
                      color: (barbershop as any).primaryColor || "#000000",
                    }}
                  >
                    {barbershop.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: (barbershop as any).textColor || "#111827",
                    }}
                  >
                    {barbershop.address}
                  </p>
                </div>

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
                      color: (barbershop as any).textColor || "#111827",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        (barbershop as any).primaryColor || "#000000";
                      e.currentTarget.style.color =
                        (barbershop as any).secondaryColor || "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        (barbershop as any).textColor || "#111827";
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Dashboard Web
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium"
                    onClick={() => {
                      router.push("/barber_app");
                      setIsOpen(false);
                    }}
                    style={{
                      backgroundColor:
                        (barbershop as any).primaryColor || "#000000",
                      color: (barbershop as any).secondaryColor || "#ffffff",
                    }}
                  >
                    <Menu className="h-4 w-4" />
                    App do Barbeiro
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push(`/barber_app/client?id=${barbershop.id}`);
                      setIsOpen(false);
                    }}
                    style={{
                      color: (barbershop as any).textColor || "#111827",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        (barbershop as any).primaryColor || "#000000";
                      e.currentTarget.style.color =
                        (barbershop as any).secondaryColor || "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        (barbershop as any).textColor || "#111827";
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                    App do Cliente
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      router.push("/barber_app/config");
                      setIsOpen(false);
                    }}
                    style={{
                      color: (barbershop as any).textColor || "#111827",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        (barbershop as any).primaryColor || "#000000";
                      e.currentTarget.style.color =
                        (barbershop as any).secondaryColor || "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        (barbershop as any).textColor || "#111827";
                    }}
                  >
                    <Palette className="h-4 w-4" />
                    Configurações
                  </Button>
                </nav>

                {/* Ações Rápidas */}
                <div
                  className="space-y-2 pt-4 border-t"
                  style={{
                    borderColor: (barbershop as any).primaryColor || "#000000",
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
                      borderColor:
                        (barbershop as any).primaryColor || "#000000",
                      color: (barbershop as any).primaryColor || "#000000",
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
                      borderColor:
                        (barbershop as any).primaryColor || "#000000",
                      color: (barbershop as any).primaryColor || "#000000",
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
                    borderColor: (barbershop as any).primaryColor || "#000000",
                  }}
                >
                  <div
                    className="text-center text-xs"
                    style={{
                      color: (barbershop as any).textColor || "#111827",
                    }}
                  >
                    <p>App do Barbeiro</p>
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
