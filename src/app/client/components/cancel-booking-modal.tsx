"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, X } from "lucide-react";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDate: Date;
  serviceName: string;
  isLessThan24Hours: boolean;
}

export default function CancelBookingModal({
  isOpen,
  onClose,
  onConfirm,
  bookingDate,
  serviceName,
  isLessThan24Hours,
}: CancelBookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 mx-4 my-8 rounded-3xl p-6">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
              </div>
              <DialogTitle className="text-white text-lg font-bold">
                Cancelar Agendamento
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-800"
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          <DialogDescription className="text-white text-base">
            Você tem certeza que deseja cancelar este agendamento?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Agendamento */}
          <div className="bg-gray-800/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Serviço:</span>
              <span className="text-white font-medium">{serviceName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Data:</span>
              <span className="text-white font-medium">
                {formatDate(bookingDate)}
              </span>
            </div>
          </div>

          {/* Aviso sobre credibilidade */}
          {isLessThan24Hours && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-1">
                    Aviso Importante
                  </h4>
                  <p className="text-yellow-300/80 text-sm leading-relaxed">
                    Você está cancelando com menos de 24 horas de antecedência.
                    Isso pode afetar sua credibilidade com a barbearia e limitar
                    futuras opções de agendamento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmação final */}
          <div className="bg-gray-800/30 rounded-2xl p-4">
            <p className="text-gray-300 text-sm text-center">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl h-12"
          >
            <X className="h-4 w-4 mr-2" />
            Manter Agendamento
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelando...
              </div>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Sim, Cancelar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
