"use client";

import { BarberShop, BarbershopService } from "@prisma/client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import EditServiceDrawer from "@/src/app/barber_app/services/components/edit-service-drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { deleteService } from "@/src/actions/delete-service";
import { toast } from "sonner";
import { useTransition } from "react";

interface DashboardServiceItemProps {
  service: BarbershopService;
  barbershop: Pick<BarberShop, "id" | "name">;
  className?: string;
}

const DashboardServiceItem = ({
  service,
  barbershop,
  className,
}: DashboardServiceItemProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(() => {
      deleteService(service.id)
        .then(() => {
          toast.success("Serviço deletado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao deletar serviço", error);
          toast.error("Erro ao deletar serviço");
        });
    });
  };

  return (
    <>
      <Card>
        <CardContent
          className={cn("flex items-center gap-3 p-3 bg-background", className)}
        >
          {/* IMAGE */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* CONTENT */}
          <div className="space-y-2 w-full">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-300">{service.description}</p>

            {/* PREÇO E BOTÕES DE AÇÃO */}
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              {/* BOTÕES DE AÇÃO */}
              <div className="flex items-center gap-2">
                {/* Botão Editar */}
                <EditServiceDrawer
                  service={{
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    price: Number(service.price),
                    imageUrl: service.imageUrl,
                    duration: service.duration,
                  }}
                />

                {/* Botão Deletar */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Deletar Serviço
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Tem certeza que deseja deletar o serviço "{service.name}
                        "? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isPending}
                      >
                        {isPending ? "Deletando..." : "Deletar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardServiceItem;
