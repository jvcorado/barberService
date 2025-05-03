"use client";

import { Calendar, Clock, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignInDialog from "@/components/sign-in-dialog";

const LP = () => {
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
            <Button
              onClick={(open) => setSignInDialogIsOpen(true)}
              className="bg-primary text-white "
            >
              Cadastre sua barbearia
            </Button>
          </nav>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden bg-barber-dark/90 backdrop-blur-sm absolute w-full py-4 animate-fade-in">
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
                  onClick={(open) => setSignInDialogIsOpen(true)}
                  variant="outline"
                  className="text-primary border-barber-gold hover:bg-primary hover:text-barber-dark"
                >
                  Entrar
                </Button>
                <Button
                  onClick={(open) => setSignInDialogIsOpen(true)}
                  className="bg-primary text-barber-dark hover:bg-primary/90"
                >
                  Cadastre sua barbearia
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    );
  };

  const Hero = () => {
    return (
      <section className="relative bg-barber-dark pt-28 pb-20 md:pt-36 md:pb-28 ">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2574&auto=format')] 
                bg-cover bg-center opacity-20"
        ></div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Agende serviços de{" "}
                <span className="text-primary">barbearia</span> com facilidade
              </h1>
              <p className="text-lg md:text-xl text-white/60 mb-8 max-w-lg mx-auto md:mx-0">
                A plataforma que simplifica reservas para barbearias e
                proporciona uma experiência sem complicações para seus clientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  onClick={(open) => setSignInDialogIsOpen(true)}
                  className="px-8 py-6 text-lg"
                  size="lg"
                >
                  Cadastre sua barbearia
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white/10 px-8 py-6 text-lg"
                  size="lg"
                >
                  Saiba mais
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-barber-dark/40 backdrop-blur-sm p-6 rounded-lg border border-barber-gold/30 shadow-xl max-w-md mx-auto md:ml-auto">
                <div className="bg-gradient-to-br from-barber-medium to-barber-dark p-1 rounded-md mb-4">
                  <div className="flex justify-between p-3 bg-barber-dark rounded-md">
                    <div>
                      <h3 className="text-primary font-bold">
                        Barbearia Corte Fino
                      </h3>
                      <p className="text-white/60 text-sm">
                        Avaliação: ⭐⭐⭐⭐⭐
                      </p>
                    </div>
                    <div className=" text-primary px-2 py-1 rounded text-sm flex items-center h-fit">
                      Aberto
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {["10:00", "11:00", "13:00", "14:00", "15:30", "16:00"].map(
                      (time, index) => (
                        <div
                          key={index}
                          className={`text-center p-2 rounded ${
                            index === 2
                              ? ""
                              : "bg-barber-medium/40 text-gray-200"
                          }  hover:text-barber-dark transition-colors cursor-pointer`}
                        >
                          {time}
                        </div>
                      ),
                    )}
                  </div>

                  <div className="bg-barber-medium/20 p-4 rounded-md">
                    <h4 className="text-barber-light font-medium mb-2">
                      Serviço selecionado
                    </h4>
                    <div className="flex justify-between text-sm">
                      <p className="text-white/60">Corte + Barba</p>
                      <p className="text-primary">R$ 60,00</p>
                    </div>
                  </div>

                  <Button
                    onClick={(open) => setSignInDialogIsOpen(true)}
                    className="w-full b text-barber-dark "
                  >
                    Confirmar Reserva
                  </Button>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-barber-medium/80 backdrop-blur-sm p-3 rounded-lg border border-barber-gold/30 shadow-lg hidden md:block animate-pulse-slow">
                <div className="text-white text-sm">
                  <p className="text-primary font-semibold">Nova reserva!</p>
                  <p>Carlos acabou de agendar um corte - 15:30</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const Features = () => {
    const features = [
      {
        icon: <Calendar className="h-10 w-10 text-primary mb-4" />,
        title: "Agenda Inteligente",
        description:
          "Sistema de agendamento online que atualiza em tempo real, evitando conflitos de horários e maximizando sua produtividade.",
      },
      {
        icon: <User className="h-10 w-10 text-primary mb-4" />,
        title: "Perfis dos Clientes",
        description:
          "Armazene histórico de serviços, preferências e notas sobre seus clientes para oferecer um atendimento personalizado.",
      },
      {
        icon: <Clock className="h-10 w-10 text-primary mb-4" />,
        title: "Lembretes Automáticos",
        description:
          "Reduza faltas com lembretes automáticos enviados por SMS e e-mail para seus clientes antes de cada compromisso.",
      },
    ];

    return (
      <section
        id="features"
        className="section-padding bg-gradient-to-b from-barber-light/5 to-transparent"
      >
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-4">
              Recursos <span className="text-primary">Exclusivos</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Nossa plataforma foi desenvolvida especialmente para barbearias,
              com todos os recursos que você precisa para impulsionar seu
              negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg- p-8 rounded-lg shadow-lg border hover:border-barber-gold/30 transition-all hover:shadow-xl text-center group"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-barber-dark rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row rounded-xl  border">
              <div className="md:w-1/2 p-8 md:p-12 rounded-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Revolucione sua{" "}
                  <span className="text-primary">barbearia</span>
                </h3>
                <p className="text-white/60 mb-6">
                  Nossa plataforma ajuda você a gerenciar todos os aspectos do
                  seu negócio: agendamentos, clientes, estoque e muito mais,
                  tudo em um só lugar.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Aumente suas reservas em até 70%",
                    "Reduza faltas em até 60%",
                    "Economize 15 horas por semana no gerenciamento",
                    "Fidelize seus clientes com lembretes personalizados",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-white/60">
                      <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 min-h-[300px] rounded-xl bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2670&auto=format')] bg-cover bg-center"></div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const HowItWorks = () => {
    const steps = [
      {
        number: "01",
        title: "Cadastre-se na plataforma",
        description:
          "Crie sua conta gratuitamente e configure o perfil da sua barbearia em minutos.",
      },
      {
        number: "02",
        title: "Configure seus serviços",
        description:
          "Adicione seus serviços, defina preços e disponibilidade para cada barbeiro da equipe.",
      },
      {
        number: "03",
        title: "Personalize sua agenda",
        description:
          "Defina seus horários de funcionamento, intervalos e períodos de descanso.",
      },
      {
        number: "04",
        title: "Comece a receber reservas",
        description:
          "Compartilhe seu link personalizado e receba reservas online imediatamente.",
      },
    ];

    return (
      <section id="how-it-works" className="section-padding bg-barber-light/5">
        <div className="container-custom">
          <div className="text-center mb-16 mt-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como <span className="text-primary">Funciona</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Começar a usar o ReservaAgora é simples e rápido. Siga os passos
              abaixo para transformar a gestão da sua barbearia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-transparent p-8 rounded-lg shadow-md border"
              >
                <span className="absolute -top-10 bg-white/10 p-2 rounded-xl -left-5 text-6xl font-bold text-primary">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold mb-3 mt-4">{step.title}</h3>
                <p className="text-white/60">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 mb-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
            <div className="bg-barber-medium p-8 rounded-lg text-white">
              <h3 className="text-3xl font-bold mb-2 text-primary">+5.000</h3>
              <p>Barbearias Cadastradas</p>
            </div>
            <div className="bg-primary p-8 rounded-lg text-barber-dark">
              <h3 className="text-3xl font-bold mb-2 text-white">+500.000</h3>
              <p>Agendamentos Realizados</p>
            </div>
            <div className="bg-barber-medium p-8 rounded-lg text-white">
              <h3 className="text-3xl font-bold mb-2 text-primary">98%</h3>
              <p>Taxa de Satisfação</p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const Testimonials = () => {
    const testimonials = [
      {
        name: "Roberto Silva",
        role: "Proprietário - Barbearia Vintage",
        image:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format",
        quote:
          "Desde que começamos a usar o ReservaAgora, reduzimos as faltas em mais de 50% e aumentamos nosso faturamento mensal em 30%. A praticidade do sistema nos permite focar no que realmente importa: cuidar dos nossos clientes.",
      },
      {
        name: "Carlos Mendes",
        role: "Cliente frequente",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format",
        quote:
          "A facilidade de agendar horários com meu barbeiro favorito pelo celular é incrível. Consigo ver a disponibilidade em tempo real e agendar até mesmo de madrugada. E adoro receber os lembretes antes do atendimento!",
      },
      {
        name: "André Martins",
        role: "Barbeiro - Barber Shop Downtown",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format",
        quote:
          "O sistema de agenda é muito intuitivo e me ajuda a organizar melhor meu dia. Consigo ver todos os meus compromissos e informações dos clientes em um só lugar, além de receber notificações sobre novos agendamentos.",
      },
    ];

    return (
      <section id="testimonials" className="section-padding bg-barber-dark">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              O que estão <span className="text-primary">dizendo</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Veja o que nossos usuários falam sobre a experiência com o
              ReservaAgora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-barber-medium/50 backdrop-blur-sm p-6 rounded-lg border border-barber-gold/10 hover:border-barber-gold/30 transition-all"
              >
                <div className="mb-6 relative">
                  <span className="text-6xl text-primary opacity-30 absolute -top-6 left-0">
                    "
                  </span>
                  <p className="text-white/60 relative z-10 pl-4">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-barber-gold"
                  />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-primary text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const CallToAction = () => {
    return (
      <section className="section-padding bg-gradient-to-b from-barber-light/5 to-transparent">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-barber-dark to-barber-medium rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para <span className="text-primary">transformar</span> sua
              barbearia?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Junte-se a milhares de barbearias que já estão economizando tempo,
              reduzindo faltas e aumentando o faturamento com nossa plataforma
              de agendamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={(open) => setSignInDialogIsOpen(true)}
                className="bg-primary text-barber-dark hover:bg-primary/90 px-8 py-6 text-lg"
                size="lg"
              >
                Começar gratuitamente
              </Button>
              <Button
                onClick={(open) => setSignInDialogIsOpen(true)}
                variant="outline"
                className="text-white border-white hover:bg-white/10 px-8 py-6 text-lg"
                size="lg"
              >
                Agendar demonstração
              </Button>
            </div>
            <p className="text-white/60 mt-6 text-sm">
              Experimente grátis por 30 dias. Não é necessário cartão de
              crédito.
            </p>
          </div>
        </div>
      </section>
    );
  };

  const Footer = () => {
    return (
      <footer className="bg-barber-dark pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <Link href="/">
                  <p className="text-primary text-lg">reserva</p>
                  <p className="-mt-2 text-lg">agora.com</p>
                </Link>
              </div>
              <p className="text-white/60 mb-6">
                A plataforma de agendamento online que transforma a gestão da
                sua barbearia.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-white/60 hover:text-primary transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-primary transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-6">
                Plataforma
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Recursos
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Como funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Depoimentos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Preços
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Empresa</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Carreiras
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    Política de Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-primary transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <main className="flex-grow container mx-auto">
        <Features />
        <HowItWorks />
        <Testimonials />
        <CallToAction />

        <Dialog
          open={signInDialogIsOpen}
          onOpenChange={(open) => setSignInDialogIsOpen(open)}
        >
          <DialogContent className="w-[90%] rounded-md">
            <SignInDialog />
          </DialogContent>
        </Dialog>
      </main>

      {/*   <Footer /> */}
    </div>
  );
};

export default LP;
