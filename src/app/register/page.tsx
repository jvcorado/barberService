"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "./components/register-form";

export default function RegisterBarbershop() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Auto-open effect removed for better UX
  }, []);

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Registrar Barbearia
                </h2>
                <p className="text-muted-foreground text-lg">
                  Junte-se agora para gerenciar sua barbearia de forma eficiente
                  desde o primeiro dia.
                </p>
              </div>

              <RegisterForm
                imageFile={imageFile}
                onImageChange={setImageFile}
                onSuccess={() => router.push("/dashboard")}
              />
            </div>

            {/* Right Column - Preview/Info */}
            <div className="bg-primary rounded-2xl shadow-xl p-8 text-primary-foreground">
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-4">
                  Gerencie sua barbearia com facilidade
                </h3>
                <p className="text-primary-foreground/80 text-lg">
                  Acesse seu dashboard e gerencie agendamentos, serviços e
                  clientes de forma simples.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">
                        📅
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Agendamentos</h4>
                      <p className="text-primary-foreground/80 text-sm">
                        Controle total sobre horários
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">
                        💰
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Financeiro</h4>
                      <p className="text-primary-foreground/80 text-sm">
                        Acompanhe receitas e despesas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">
                        👥
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Clientes</h4>
                      <p className="text-primary-foreground/80 text-sm">
                        Histórico completo de atendimentos
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-primary-foreground/80 text-sm">
                    Disponível
                  </div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-primary-foreground/80 text-sm">
                    Seguro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
