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
