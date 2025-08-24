"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BarberAppLayout from "./components/barber-app-layout";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { usePWA } from "@/hooks/use-pwa";
import { PWAToast } from "@/components/pwa-toast";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
import {
  Star,
  ThumbsUp,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
  Download,
  Wifi,
  WifiOff,
} from "lucide-react";

interface BookingWithDetails {
  id: string;
  date: Date;
  user?: {
    name?: string | null;
  };
  service?: {
    name?: string | null;
  };
}

interface Barbershop {
  id: string;
  name: string;
  address: string;
  imageUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  services: any[];
}

export default function BarberAppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    requestNotificationPermission,
    sendNotification,
  } = usePWA();
  const { colors } = useBarbershopColors();
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (session?.user) {
      fetchBarbershopData();
    }
  }, [session, status]);

  const fetchBarbershopData = async () => {
    try {
      const response = await fetch("/api/barbershops/me");
      if (response.ok) {
        const data = await response.json();
        setBarbershop(data.barbershop);
        setBookings(data.bookings || []);
      } else {
        router.push("/register");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      router.push("/register");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading || status === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.backgroundColor }}
      >
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
  if (status === "unauthenticated" || !barbershop) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.backgroundColor }}
      >
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
    <BarberAppLayout barbershop={barbershop}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: (barbershop as any).backgroundColor || "#f9fafb",
          color: (barbershop as any).textColor || "#111827",
        }}
      >
        {/* Header */}
        <div
          className="border-b px-4 py-3"
          style={{
            backgroundColor: colors.secondaryColor,
            borderColor: colors.primaryColor,
          }}
        >
          <div className="flex items-center justify-center">
            <h1
              className="text-lg font-semibold"
              style={{
                color: colors.primaryColor,
              }}
            >
              {barbershop.name}
            </h1>
          </div>
        </div>

        {/* Perfil do Barbeiro */}
        <div
          className="px-4 py-6"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.accentColor + "20" }}
            >
              {barbershop.imageUrl ? (
                <SafeImage
                  src={barbershop.imageUrl}
                  alt={barbershop.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accentColor + "30" }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: colors.textColor }}
                  >
                    {barbershop.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2
                className="text-xl font-bold"
                style={{ color: colors.primaryColor }}
              >
                {barbershop.name}
              </h2>
              <p className="mb-3" style={{ color: colors.textColor }}>
                {barbershop.address}
              </p>

              {/* <div className="flex items-center gap-4 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  style={{
                    borderColor: (barbershop as any).primaryColor || "#000000",
                    color: (barbershop as any).primaryColor || "#000000",
                  }}
                >
                  <Phone className="h-4 w-4" />
                  Ligar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  style={{
                    borderColor: (barbershop as any).primaryColor || "#000000",
                    color: (barbershop as any).primaryColor || "#000000",
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Mensagem
                </Button>
              </div> */}
            </div>
          </div>

          {/* Avaliações e Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star
                  className="h-4 w-4 fill-current"
                  style={{ color: colors.accentColor }}
                />
                <span
                  className="font-semibold"
                  style={{ color: colors.primaryColor }}
                >
                  4.6/5
                </span>
              </div>
              <p className="text-sm" style={{ color: colors.textColor }}>
                (123)
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ThumbsUp
                  className="h-4 w-4"
                  style={{ color: colors.accentColor }}
                />
                <span
                  className="font-semibold"
                  style={{ color: colors.primaryColor }}
                >
                  46%
                </span>
              </div>
              <p className="text-sm" style={{ color: colors.textColor }}>
                Recomendado
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar
                  className="h-4 w-4"
                  style={{ color: colors.accentColor }}
                />
                <span
                  className="font-semibold"
                  style={{ color: colors.primaryColor }}
                >
                  {bookings.length}
                </span>
              </div>
              <p className="text-sm" style={{ color: colors.textColor }}>
                Agendamentos
              </p>
            </div>
          </div>

          {/* Status PWA */}
          {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Status do App
              </span>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-xs text-gray-500">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {isInstalled ? "App instalado" : "App não instalado"}
              </span>

              {isInstallable && !isInstalled && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={installApp}
                  className="gap-2 h-7 text-xs"
                  style={{
                    borderColor: (barbershop as any).primaryColor || "#000000",
                    color: (barbershop as any).primaryColor || "#000000",
                  }}
                >
                  <Download className="h-3 w-3" />
                  Instalar
                </Button>
              )}
            </div>
          </div> */}
        </div>

        {/* Galeria de Fotos */}
        <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.primaryColor }}
            >
              Galeria de Fotos
            </h3>
            <Button
              variant="ghost"
              className="p-0 h-auto"
              style={{ color: colors.accentColor }}
            >
              Ver mais <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: colors.accentColor + "20" }}
              >
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: colors.accentColor + "30" }}
                  >
                    <span
                      className="text-lg"
                      style={{ color: colors.textColor }}
                    >
                      📷
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.textColor }}>
                    Foto {i}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barbearia */}
        <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.primaryColor }}
          >
            Barbearia
          </h3>

          <div
            className="aspect-video rounded-lg overflow-hidden mb-4"
            style={{ backgroundColor: colors.accentColor + "20" }}
          >
            {barbershop.imageUrl ? (
              <SafeImage
                src={barbershop.imageUrl}
                alt="Barbearia"
                width={400}
                height={225}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: colors.accentColor + "30" }}
                  >
                    <span
                      className="text-2xl"
                      style={{ color: colors.textColor }}
                    >
                      🏪
                    </span>
                  </div>
                  <p style={{ color: colors.textColor }}>Imagem da Barbearia</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5" style={{ color: colors.textColor }} />
              <span style={{ color: colors.textColor }}>
                Seg a Sáb - 9h às 18h
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5" style={{ color: colors.textColor }} />
              <span style={{ color: colors.textColor }}>
                {barbershop.address}
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              style={{
                borderColor: colors.primaryColor,
                color: colors.primaryColor,
              }}
            >
              <MapPin className="h-4 w-4" />
              Mostrar no mapa
            </Button>
          </div>
        </div>

        {/* Link para App do Cliente */}
        {/* <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: (barbershop as any).secondaryColor || "#ffffff",
          }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Compartilhe com seus Clientes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Envie este link para seus clientes agendarem serviços diretamente
              pelo app
            </p>

            <div className="p-3 bg-gray-50 rounded-lg border mb-4">
              <p className="text-xs text-gray-500 mb-1">
                Link do App do Cliente:
              </p>
              <p className="text-sm font-mono text-gray-700 break-all">
                {barbershop.id
                  ? `/barber_app/client?id=${barbershop.id}`
                  : "Carregando..."}
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              style={{
                borderColor: (barbershop as any).primaryColor || "#000000",
                color: (barbershop as any).primaryColor || "#000000",
              }}
              onClick={async () => {
                try {
                  const url = `/barber_app/client?id=${barbershop.id}`;
                  await navigator.clipboard.writeText(url);
                  setToast({
                    message: "Link copiado para a área de transferência!",
                    type: "success",
                  });
                } catch (error) {
                  setToast({
                    message: "Erro ao copiar link",
                    type: "error",
                  });
                }
              }}
            >
              Copiar Link
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              style={{
                borderColor: (barbershop as any).primaryColor || "#000000",
                color: (barbershop as any).primaryColor || "#000000",
              }}
              onClick={async () => {
                try {
                  const hasPermission = await requestNotificationPermission();
                  if (hasPermission) {
                    sendNotification("BarberApp", {
                      body: "Teste de notificação funcionando!",
                      icon: "/logo.png",
                    });
                    setToast({
                      message: "Notificação enviada com sucesso!",
                      type: "success",
                    });
                  } else {
                    setToast({
                      message: "Permissão de notificação negada",
                      type: "error",
                    });
                  }
                } catch (error) {
                  setToast({
                    message: "Erro ao enviar notificação",
                    type: "error",
                  });
                }
              }}
            >
              Testar Notificação
            </Button>
          </div>
        </div> */}

        {/* Avaliações */}
        <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.primaryColor }}
            >
              Avaliações
            </h3>
            <Button
              variant="ghost"
              className="p-0 h-auto"
              style={{ color: colors.accentColor }}
            >
              Ver todas <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accentColor + "20" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.textColor }}
                  >
                    {booking.user?.name?.charAt(0) || "C"}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-medium"
                      style={{ color: colors.primaryColor }}
                    >
                      {booking.user?.name || "Cliente"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star
                        className="h-4 w-4 fill-current"
                        style={{ color: colors.accentColor }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.textColor }}
                      >
                        5/5
                      </span>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: colors.textColor }}>
                    Excelente serviço!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div
          className="fixed bottom-0 left-0 right-0 border-t p-4 space-y-4"
          style={{
            backgroundColor: colors.secondaryColor,
            borderColor: colors.primaryColor,
          }}
        >
          <Button
            className="w-full py-3 text-lg font-semibold"
            style={{
              backgroundColor: colors.primaryColor,
              color: colors.secondaryColor,
            }}
            onClick={() => {
              router.push(`/barber_app/client?id=${barbershop.id}`);
            }}
          >
            Acessar App do Cliente
          </Button>

          <Button
            variant="outline"
            className="w-full py-2"
            style={{
              borderColor: colors.primaryColor,
              color: colors.primaryColor,
            }}
            onClick={() => {
              router.push(`/dashboard`);
            }}
          >
            Ir para Dashboard Web
          </Button>
        </div>

        {/* Espaço para o botão fixo */}
        <div className="h-20"></div>
      </div>

      {/* Toast PWA */}
      {toast && (
        <PWAToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </BarberAppLayout>
  );
}
