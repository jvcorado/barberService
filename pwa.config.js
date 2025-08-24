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

  // Configurações de Notificações
  notifications: {
    defaultIcon: "/logo.png",
    defaultBadge: "/logo.png",
    defaultVibrate: [100, 50, 100],
    defaultTag: "barber-app",
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
