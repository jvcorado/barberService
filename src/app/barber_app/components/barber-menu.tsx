"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Copy,
  Share2,
  QrCode,
  ExternalLink,
  Download,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import QRCode from "qrcode";

interface BarberMenuProps {
  barbershopId?: string;
  barbershopName?: string;
}

export default function BarberMenu({
  barbershopId,
  barbershopName,
}: BarberMenuProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // Gerar o link da barberia
  const barberLink = `${window.location.origin}/barber_app/client?id=${barbershopId}`;

  // Gerar QR code
  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(barberLink, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      toast.error("Erro ao gerar QR code");
    }
  };

  // Download do QR code
  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement("a");
    link.download = `qr-code-${barbershopName || "barbearia"}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code baixado com sucesso!");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(barberLink);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      toast.error("Erro ao copiar o link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Agende seu horário na ${barbershopName || "Barbearia"}`,
          text: `Acesse o link para agendar seu horário:`,
          url: barberLink,
        });
      } catch (error) {
        // Se o usuário cancelar o compartilhamento, não mostrar erro
        if ((error as { name?: string })?.name !== "AbortError") {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      handleCopyLink();
    }
  };

  const handleOpenLink = () => {
    window.open(barberLink, "_blank");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-l border-white/10"
      >
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-white text-xl font-semibold">
            Menu da Barbearia
          </SheetTitle>

          <div className="space-y-2">
            <p className="text-gray-300 text-sm">
              Olá,{" "}
              <span className="text-blue-400 font-medium">
                {session?.user?.name?.split(" ")[0]}
              </span>
              !
            </p>
            {barbershopName && (
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {barbershopName}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Seção do Link da Barbearia */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">
              Link da Barbearia
            </h3>
            <p className="text-gray-300 text-sm">
              Compartilhe este link com seus clientes para que eles possam
              agendar horários:
            </p>

            {/* Input com o link */}
            <div className="space-y-3">
              <div className="relative">
                <Input
                  value={barberLink}
                  readOnly
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-20"
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 h-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Botões de ação */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleShare}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>

                <Button
                  onClick={handleOpenLink}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir Link
                </Button>
              </div>
            </div>
          </div>

          {/* Seção QR Code */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold text-lg">QR Code</h3>

            <div className="space-y-4">
              {!qrCodeDataUrl ? (
                <div className="text-center space-y-3">
                  <div className="w-32 h-32 mx-auto bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Gere um QR code para compartilhar facilmente
                  </p>
                  <Button
                    onClick={generateQRCode}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-32 h-32 mx-auto bg-white rounded-lg p-2 border border-white/20">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code da Barbearia"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={downloadQRCode}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                    <Button
                      onClick={() => setQrCodeDataUrl("")}
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Regenerar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seção de Informações */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold text-lg">Informações</h3>

            <div className="text-xs text-gray-400 space-y-1">
              <p>• Clientes podem agendar horários 24/7</p>
              <p>• Receba notificações de novos agendamentos</p>
              <p>• Gerencie sua agenda facilmente</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
