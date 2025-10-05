/**
 * Configuração PWA para BarberApp
 * Este arquivo centraliza todas as configurações PWA
 */

module.exports = {
  // Configurações do Service Worker
  serviceWorker: {
    name: "sw.js",
    scope: "/",
    updateViaCache: "none",
    skipWaiting: true,
    clientsClaim: true,
  },

  // Configurações do Manifest
  manifest: {
    name: "App do Barbeiro",
    short_name: "BarberApp",
    description:
      "Aplicativo mobile para gerenciamento da barbearia com funcionalidades offline",
    start_url: "/barber_app",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait-primary",
    scope: "/barber_app",
    lang: "pt-BR",
    categories: ["business", "productivity", "lifestyle"],
    prefer_related_applications: false,
  },

  // Configurações do Manifest do Cliente
  manifestClient: {
    name: "BarberApp Cliente",
    short_name: "BarberApp",
    description:
      "Aplicativo mobile para clientes agendarem serviços na barbearia",
    start_url: "/client",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait-primary",
    scope: "/client",
    lang: "pt-BR",
    categories: ["business", "productivity", "lifestyle"],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Agendar Serviço",
        short_name: "Agendar",
        description: "Agendar um novo serviço",
        url: "/client/book",
        icons: [
          {
            src: "/logo.png",
            sizes: "96x96",
          },
        ],
      },
      {
        name: "Meus Agendamentos",
        short_name: "Agendamentos",
        description: "Ver meus agendamentos",
        url: "/client",
        icons: [
          {
            src: "/logo.png",
            sizes: "96x96",
          },
        ],
      },
    ],
  },

  // Configurações de Cache
  cache: {
    name: "barber-app-v1",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    strategies: {
      static: "cache-first",
      api: "network-first",
      page: "stale-while-revalidate",
    },
  },

  // Configurações de Cache do Cliente
  cacheClient: {
    name: "barber-app-client-v1",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    strategies: {
      static: "cache-first",
      api: "network-first",
      page: "stale-while-revalidate",
    },
  },

  // Configurações de Notificações
  notifications: {
    defaultIcon: "/logo.png",
    defaultBadge: "/logo.png",
    defaultVibrate: [100, 50, 100],
    defaultTag: "barber-app",
  },

  // Configurações de Notificações do Cliente
  notificationsClient: {
    defaultIcon: "/logo.png",
    defaultBadge: "/logo.png",
    defaultVibrate: [100, 50, 100],
    defaultTag: "barber-app-client",
    actions: [
      {
        action: "view",
        title: "Ver",
        icon: "/logo.png",
      },
      {
        action: "close",
        title: "Fechar",
        icon: "/logo.png",
      },
    ],
  },

  // Configurações de Ícones
  icons: [
    {
      src: "/logo.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "/logo.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],

  // Configurações de Build
  build: {
    outputDir: "out",
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  },

  // Configurações de Desenvolvimento
  dev: {
    port: 3000,
    hostname: "localhost",
    https: false,
  },
};
