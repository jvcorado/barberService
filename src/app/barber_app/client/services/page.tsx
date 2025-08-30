"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientLayout from "../components/client-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft, Clock, Search } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration?: number | null;
  imageUrl?: string | null;
}

interface BarberShop {
  id: string;
  name: string;
  address: string;
  imageUrl?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  services: Service[];
}

export default function ServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const barbershopId = searchParams.get("barbershopId");
  const [barbershop, setBarbershop] = useState<BarberShop | null>(null);
  const [activeTab, setActiveTab] = useState<"servicos" | "produtos">(
    "servicos",
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push(`/barber_app/client/login?id=${barbershopId}`);
      return;
    }

    if (!barbershopId) {
      router.push("/");
      return;
    }

    if (session?.user) {
      fetchData();
    }
  }, [session, status, barbershopId, router]);

  const fetchData = async () => {
    try {
      const barbershopResponse = await fetch(
        `/api/barbershops/${barbershopId}`,
      );
      if (barbershopResponse.ok) {
        const barbershopData = await barbershopResponse.json();
        setBarbershop(barbershopData);
        setFilteredServices(barbershopData.services);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  // Função para filtrar serviços
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!barbershop?.services) return;

    if (!term.trim()) {
      setFilteredServices(barbershop.services);
    } else {
      const filtered = barbershop.services.filter(
        (service) =>
          service.name.toLowerCase().includes(term.toLowerCase()) ||
          (service.description &&
            service.description.toLowerCase().includes(term.toLowerCase())),
      );
      setFilteredServices(filtered);
    }
  };

  // Loading state
  if (loading || status === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: barbershop?.backgroundColor || "#f9fafb" }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-2xl h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ borderColor: barbershop?.primaryColor || "#000000" }}
            ></div>
            <p style={{ color: barbershop?.textColor || "#111827" }}>
              Carregando...
            </p>
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
        style={{ backgroundColor: barbershop?.backgroundColor || "#f9fafb" }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p
              className="mb-4"
              style={{ color: barbershop?.textColor || "#111827" }}
            >
              Você precisa estar logado para acessar o app
            </p>
            <Button
              onClick={() => router.push("/api/auth/signin")}
              style={{
                backgroundColor: barbershop?.primaryColor || "#000000",
                color: barbershop?.secondaryColor || "#ffffff",
              }}
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClientLayout barbershop={barbershop}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: barbershop.backgroundColor || "#f9fafb",
        }}
      >
        {/* Carrossel de Imagens dos Cortes - Parte Superior */}
        <div className="relative h-64 overflow-hidden">
          {/* Botão Voltar - Sobreposto */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 left-6 z-20 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>

          {/* Carrossel */}
          <div className="flex h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            {[
              {
                url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2670&auto=format",
                fallback: "✂️",
              },
              {
                url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2574&auto=format",
                fallback: "💇‍♂️",
              },
              {
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2670&auto=format",
                fallback: "🧔‍♂️",
              },
              {
                url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669&auto=format",
                fallback: "🎨",
              },
              {
                url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2670&auto=format",
                fallback: "🌟",
              },
            ].map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-screen h-full bg-gray-800 flex items-center justify-center snap-center"
              >
                <Image
                  src={image.url}
                  alt={`Corte ${index + 1}`}
                  width={400}
                  height={256}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback para emoji se a imagem falhar
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-4xl">${image.fallback}</span>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="px-6 mb-6">
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab("servicos")}
              className={`flex-1 py-3 text-center text-white font-medium transition-colors ${
                activeTab === "servicos"
                  ? "border-b-2 border-blue-500"
                  : "text-white/60"
              }`}
            >
              SERVIÇOS
            </button>
            <button
              onClick={() => setActiveTab("produtos")}
              className={`flex-1 py-3 text-center text-white font-medium transition-colors ${
                activeTab === "produtos"
                  ? "border-b-2 border-blue-500"
                  : "text-white/60"
              }`}
            >
              PRODUTOS
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="px-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar serviço..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Lista de Serviços */}
        {activeTab === "servicos" && (
          <div className="px-6 space-y-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* Ícone do Serviço */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {service.imageUrl ? (
                      <Image
                        src={service.imageUrl}
                        alt={service.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg">✂️</span>
                    )}
                  </div>

                  {/* Informações do Serviço */}
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: barbershop.accentColor || "#60a5fa" }}
                      >
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(service.price))}
                      </span>
                      <div className="flex items-center gap-1 text-white/60">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration || 30} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Agendar */}
                <Button
                  size="sm"
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: barbershop.accentColor || "#60a5fa",
                    color: barbershop.secondaryColor || "#ffffff",
                  }}
                  onClick={() => {
                    router.push(
                      `/barber_app/client/book?barbershopId=${barbershop.id}&serviceId=${service.id}&step=2`,
                    );
                  }}
                >
                  Agendar
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Lista de Produtos */}
        {activeTab === "produtos" && (
          <div className="px-6 py-8 text-center">
            <p className="text-white/60">Produtos em breve...</p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
