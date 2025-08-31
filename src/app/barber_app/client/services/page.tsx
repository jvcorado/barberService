"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Search, ChevronLeft } from "lucide-react";
import Image from "next/image";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // No session state
  if (status === "unauthenticated" || !barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-gray-300 mb-6">
            Você precisa estar logado para acessar os serviços
          </p>
          <Button
            onClick={() =>
              router.push(`/barber_app/client/login?id=${barbershopId}`)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Carrossel de Imagens dos Cortes - Preenchendo o Espaço */}
      <div className="relative h-64 overflow-hidden mb-6">
        {/* Botão Voltar - Sobreposto */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-20 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20"
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
                height={192}
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

      {/* Barra de Pesquisa */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar serviço..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 text-white rounded-2xl border border-white/20 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Lista de Serviços */}
      <div className="px-6 space-y-3 pb-24">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                {service.description && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2 py-1 rounded-full text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration || 30} min
                  </Badge>
                </div>
              </div>

              <div className="text-right ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(service.price))}
                </p>

                <Button
                  className="px-6 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 border border-white/20"
                  onClick={() => {
                    router.push(
                      `/barber_app/client/book?barbershopId=${barbershop.id}&serviceId=${service.id}`,
                    );
                  }}
                >
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              {searchTerm
                ? "Nenhum serviço encontrado"
                : "Nenhum serviço disponível"}
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Limpar pesquisa
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
