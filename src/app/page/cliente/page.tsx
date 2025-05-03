"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, MapPin, Star, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Cliente = () => {
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Header = () => {
    return (
      <header className="bg-barber-dark/90 backdrop-blur-sm py-4 fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/page">
            {/*  <Image alt="FSW Barber" src="/logo.png" height={18} width={120} /> */}
            <p className="text-primary text-lg">reserva</p>
            <p className="-mt-2 text-lg">agora.com</p>
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="#features"
              className="text-white/60 hover:text-primary transition-colors"
            >
              Recursos
            </a>
            <a
              href="#how-it-works"
              className="text-white/60 hover:text-primary transition-colors"
            >
              Como Funciona
            </a>
            <a
              href="#testimonials"
              className="text-white/60 hover:text-primary transition-colors"
            >
              Depoimentos
            </a>
            <Button
              onClick={(open) => setSignInDialogIsOpen(true)}
              variant="outline"
              className="ml-4 text-white/60 border-barber-gold "
            >
              Entrar
            </Button>
            <Button className="bg-primary text-white ">
              Cadastre sua barbearia
            </Button>
          </nav>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden bg-barber-dark absolute w-full py-4 animate-fade-in">
            <nav className="flex flex-col gap-4 px-4">
              <a
                href="#features"
                className="text-primary hover:text-primary transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </a>
              <a
                href="#how-it-works"
                className="text-primary hover:text-primary transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Como Funciona
              </a>
              <a
                href="#testimonials"
                className="text-primary hover:text-primary transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Depoimentos
              </a>
              <div className="flex flex-col gap-3 mt-4">
                <Button
                  variant="outline"
                  className="text-primary border-barber-gold hover:bg-primary hover:text-barber-dark"
                >
                  Entrar
                </Button>
                <Button className="bg-primary text-barber-dark hover:bg-primary/90">
                  Cadastre sua barbearia
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    );
  };

  const barbershops = [
    {
      id: 1,
      name: "Barbearia Corte Fino",
      rating: 5.0,
      location: "Rua das Flores, 123 - Centro",
      image:
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2574&auto=format",
      services: ["Corte", "Barba", "Sobrancelha"],
      price: "A partir de R$ 35,00",
    },
    {
      id: 2,
      name: "Barber Shop Downtown",
      rating: 4.8,
      location: "Av. Paulista, 1500 - Bela Vista",
      image:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2670&auto=format",
      services: ["Corte", "Barba", "Pezinho", "Coloração"],
      price: "A partir de R$ 40,00",
    },
    {
      id: 3,
      name: "Vintage Barbershop",
      rating: 4.7,
      location: "Rua Augusta, 789 - Consolação",
      image:
        "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?q=80&w=3387&auto=format",
      services: ["Corte Premium", "Barba Completa", "Tratamento Capilar"],
      price: "A partir de R$ 50,00",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto">
        {/* Hero Section */}
        <section className="bg-barber-dark pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Encontre e agende na melhor{" "}
                <span className="text-barber-gold">barbearia</span> perto de
                você
              </h1>
              <p className="text-gray-300 mb-8">
                Agende seu horário em minutos e esqueça as filas de espera
              </p>

              {/* Search Bar */}
              <div className="bg-primary p-2 rounded-lg flex flex-col md:flex-row gap-2">
                <div className="flex-grow flex items-center bg-gray-100 rounded px-3">
                  <Search size={20} className="text-gray-500 mr-2" />
                  <Input
                    type="text"
                    placeholder="Buscar por barbearia ou localização"
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  />
                </div>
                <Button className="bg-primary text-barber-dark hover:bg-primary/90">
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Barbershops Listing */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Barbearias <span className="text-barber-gold">Populares</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbershops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${shop.image})` }}
                  >
                    <div className="bg-primary/90 text-barber-dark px-3 py-1 rounded-br-lg inline-block">
                      <div className="flex items-center">
                        <Star size={16} className="fill-barber-dark" />
                        <span className="ml-1 font-medium">
                          {shop.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2">{shop.name}</h3>

                    <div className="flex items-start mb-3 text-gray-600">
                      <MapPin size={16} className="mt-1 mr-1 flex-shrink-0" />
                      <span className="text-sm">{shop.location}</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {shop.services.map((service, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{shop.price}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock size={14} className="mr-1" />
                        <span>Horários disponíveis</span>
                      </div>
                      <Button className="bg-primary text-barber-dark hover:bg-primary/90">
                        Agendar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-barber-gold text-barber-gold hover:bg-primary/10"
              >
                Ver mais barbearias
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="section-padding bg-barber-light/5">
          <div className="container-custom">
            <div className="bg-barber-dark rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Por que usar o{" "}
                    <span className="text-barber-gold">ReservaAgora</span>?
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center">
                      <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                      Escolha seu barbeiro favorito
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                      Agende em qualquer hora do dia
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                      Receba lembretes antes do seu horário
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                      Acumule pontos e ganhe descontos
                    </li>
                  </ul>
                  <Button className="mt-8 bg-primary text-barber-dark hover:bg-primary/90">
                    Criar uma conta
                  </Button>
                </div>
                <div className="md:w-1/2 min-h-[300px] bg-[url('https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=3270&auto=format')] bg-cover bg-center"></div>
              </div>
            </div>
          </div>
        </section>

        {/* App Download */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Baixe nosso <span className="text-barber-gold">aplicativo</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Agende seu horário de forma ainda mais rápida e receba
                notificações diretamente no seu celular.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-black text-white rounded-xl px-8 py-4 flex items-center w-64 hover:bg-black/90 transition-colors cursor-pointer">
                  <div className="mr-3">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M17.05,11.27C17.05,14.29 14.6,16.73 11.57,16.73C8.55,16.73 6.1,14.29 6.1,11.27C6.1,8.24 8.55,5.8 11.57,5.8C14.6,5.8 17.05,8.24 17.05,11.27M16.75,17.03C15.2,18.23 13.25,18.92 11.13,18.92C9,18.92 7.05,18.23 5.5,17.03C2.43,19.27 0.77,22.69 0,27.32H22.27C21.48,22.69 19.83,19.27 16.75,17.03M21.08,7.35C21.08,9.1 20.03,10.61 18.54,11.32C18.73,10.66 18.83,9.97 18.83,9.26C18.83,7.5 18.25,5.88 17.25,4.57C18.93,5.11 21.08,6.45 21.08,7.35M14.5,4C16.36,4 17.87,5.5 17.87,7.35C17.87,9.21 16.36,10.71 14.5,10.71C12.64,10.71 11.13,9.21 11.13,7.35C11.13,5.5 12.64,4 14.5,4M8.63,11.32C7.14,10.61 6.09,9.1 6.09,7.35C6.09,6.44 8.24,5.11 9.92,4.57C8.93,5.88 8.35,7.5 8.35,9.26C8.35,9.97 8.44,10.66 8.63,11.32M9.5,10.71C7.64,10.71 6.13,9.21 6.13,7.35C6.13,5.5 7.64,4 9.5,4C11.36,4 12.87,5.5 12.87,7.35C12.87,9.21 11.36,10.71 9.5,10.71Z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Baixe na</div>
                    <div className="text-lg font-medium">App Store</div>
                  </div>
                </div>

                <div className="bg-black text-white rounded-xl px-8 py-4 flex items-center w-64 mt-4 hover:bg-black/90 transition-colors cursor-pointer">
                  <div className="mr-3">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M16.61,5.73C16.19,5.31 15.67,5.1 15.06,5.1C14.46,5.1 13.93,5.31 13.5,5.73L12,7.22L10.5,5.73C10.07,5.31 9.54,5.1 8.94,5.1C8.33,5.1 7.8,5.31 7.39,5.73C6.97,6.15 6.75,6.68 6.75,7.28C6.75,7.89 6.97,8.42 7.39,8.84L12,13.44L16.61,8.84C17.03,8.42 17.25,7.89 17.25,7.28C17.25,6.68 17.03,6.15 16.61,5.73M17.61,1C19.07,1 20.32,1.5 21.36,2.5C22.4,3.54 22.92,4.77 22.92,6.21C22.92,7.65 22.4,8.88 21.36,9.92L12,19.28L2.64,9.92C1.6,8.88 1.08,7.65 1.08,6.21C1.08,4.77 1.6,3.54 2.64,2.5C3.68,1.5 4.93,1 6.39,1C7.85,1 9.1,1.5 10.14,2.5L12,4.33L13.86,2.5C14.9,1.5 16.15,1 17.61,1Z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Disponível no</div>
                    <div className="text-lg font-medium">Google Play</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-0">
                <img
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=3280&auto=format"
                  alt="Aplicativo ReservaAgora"
                  className="max-h-80 rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cliente;
