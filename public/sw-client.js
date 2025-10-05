const CACHE_NAME = "barber-app-client-v1";
const STATIC_CACHE = "barber-app-client-static-v1";
const DYNAMIC_CACHE = "barber-app-client-dynamic-v1";

// URLs para cache estático
const STATIC_URLS = [
  "/client",
  "/client/book",
  "/logo.png",
  "/manifest-client.json",
];

// Não faz precache de APIs; cache dinâmico será feito em runtime
const DYNAMIC_URLS = [];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_URLS);
      }),
      // Pula precache dinâmico para evitar falhas em install
      caches.open(DYNAMIC_CACHE),
    ]).then(() => {
      self.skipWaiting();
    }),
  );
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          }),
        );
      }),
      // Tomar controle dos clientes
      self.clients.claim(),
    ]),
  );
});

// Interceptação de requisições
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia para páginas do app
  if (request.mode === "navigate" && url.pathname.startsWith("/client")) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        });
      }),
    );
    return;
  }

  // Estratégia para APIs
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        }),
    );
    return;
  }

  // Estratégia para recursos estáticos
  if (
    request.destination === "image" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        });
      }),
    );
    return;
  }

  // Estratégia padrão: network first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    }),
  );
});

// Sincronização em background
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Implementar sincronização de dados offline
      console.log("Sincronização em background iniciada"),
    );
  }
});

// Notificações push
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Novo agendamento disponível!",
    icon: "/logo.png",
    badge: "/logo.png",
    vibrate: [100, 50, 100],
    tag: "barber-app-client",
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
  };

  event.waitUntil(
    self.registration.showNotification("BarberApp Cliente", options),
  );
});

// Clique em notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/client"));
  }
});
