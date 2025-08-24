// Importa configurações
importScripts("/sw-config.js");

const CACHE_NAME = SW_CONFIG.cacheName;
const urlsToCache = SW_CONFIG.urlsToCache;
const maxAge = SW_CONFIG.maxAge;

// Instalação do service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Interceptação de requisições para cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia para APIs
  if (SW_CONFIG.apiCache.some((api) => url.pathname.startsWith(api))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Estratégia para assets estáticos
  if (SW_CONFIG.staticAssets.some((asset) => url.pathname.includes(asset))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estratégia para imagens externas (Firebase Storage, etc.)
  if (
    SW_CONFIG.externalDomains.some((domain) => url.hostname.includes(domain))
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estratégia padrão para páginas
  event.respondWith(staleWhileRevalidate(request));
});

// Estratégia Network First (para APIs)
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Estratégia Cache First (para assets estáticos)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// Estratégia Stale While Revalidate (para páginas)
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  });

  return cachedResponse || fetchPromise;
}

// Atualização do service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Notificações push (para futuras implementações)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Nova notificação do BarberApp",
    icon: "/logo.png",
    badge: "/logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(self.registration.showNotification("BarberApp", options));
});

// Clique em notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow("/barber_app"));
});
