// Configurações do Service Worker
const SW_CONFIG = {
  version: "1.0.0",
  cacheName: "barber-app-v1",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  urlsToCache: [
    "/",
    "/barber_app",
    "/barber_app/services",
    "/barber_app/invoices",
    "/barber_app/clients",
    "/client",
    "/api/barbershops/me",
    "/api/bookings/user",
    "/api/bookings/calendar",
    "/logo.png",
    "/manifest.json",
    "/barber_app/manifest.json",
    "/sw.js",
  ],
  externalDomains: ["storage.googleapis.com", "utfs.io"],
  apiCache: [
    "/api/barbershops/me",
    "/api/bookings/user",
    "/api/bookings/calendar",
    "/api/register-barbershop",
    "/api/upload",
  ],
  staticAssets: ["/logo.png", "/manifest.json"],
};

// Estratégias de cache
const CACHE_STRATEGIES = {
  // Cache First para assets estáticos
  static: "cache-first",
  // Network First para APIs
  api: "network-first",
  // Stale While Revalidate para páginas
  page: "stale-while-revalidate",
};

// Exporta configurações
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SW_CONFIG, CACHE_STRATEGIES };
} else if (typeof self !== "undefined") {
  // Ambiente de Service Worker
  self.SW_CONFIG = SW_CONFIG;
  self.CACHE_STRATEGIES = CACHE_STRATEGIES;
} else if (typeof window !== "undefined") {
  // Ambiente do navegador
  window.SW_CONFIG = SW_CONFIG;
  window.CACHE_STRATEGIES = CACHE_STRATEGIES;
}
