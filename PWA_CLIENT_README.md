# BarberApp Cliente - PWA

## Visão Geral

O app do cliente do BarberApp é um **Progressive Web App (PWA)** que permite aos clientes agendarem serviços na barbearia diretamente do seu dispositivo móvel, com funcionalidades offline e experiência nativa.

## Funcionalidades PWA

### 🚀 **Instalação**

- **Banner de instalação** automático quando disponível
- **Instalação nativa** no dispositivo (Android/iOS)
- **Ícone personalizado** na tela inicial
- **Modo standalone** sem barra de navegação

### 📱 **Experiência Mobile**

- **Interface responsiva** otimizada para mobile
- **Gestos touch** nativos
- **Navegação por swipe** entre seções
- **Tela cheia** sem elementos do navegador

### 🔄 **Funcionalidades Offline**

- **Cache inteligente** de páginas e recursos
- **Sincronização em background** quando online
- **Dados offline** para consulta
- **Service Worker** dedicado para o cliente

### 🔔 **Notificações**

- **Lembretes de agendamento** (1 hora antes)
- **Notificações push** para atualizações
- **Permissões granulares** de notificação
- **Ações rápidas** nas notificações

### ⚡ **Performance**

- **Carregamento instantâneo** de páginas em cache
- **Estratégias de cache** otimizadas
- **Lazy loading** de recursos
- **Compressão** de imagens e assets

## Estrutura de Arquivos

```
src/app/client
├── layout.tsx              # Layout PWA com meta tags
├── page.tsx                # Página principal do cliente
└── book/
    └── page.tsx            # Página de agendamento

public/
├── manifest-client.json     # Manifest PWA do cliente
├── sw-client.js            # Service Worker do cliente
└── logo.png                # Ícones PWA

src/components/
├── pwa-client-install-banner.tsx  # Banner de instalação
└── offline-indicator.tsx          # Indicador offline

src/hooks/
└── use-pwa-client.tsx             # Hook PWA do cliente
```

## Configuração PWA

### Manifest (`manifest-client.json`)

```json
{
  "name": "BarberApp Cliente",
  "short_name": "BarberApp",
  "start_url": "/barber_app/client",
  "display": "standalone",
  "scope": "/barber_app/client",
  "shortcuts": [
    {
      "name": "Agendar Serviço",
      "url": "/client/book"
    }
  ]
}
```

### Service Worker (`sw-client.js`)

- **Cache estático** para páginas principais
- **Cache dinâmico** para APIs e dados
- **Estratégias de cache** inteligentes
- **Sincronização em background**

## Como Usar

### 1. **Acesso Inicial**

- Acesse `/client?id={barbershopId}`
- Faça login com sua conta
- O banner de instalação aparecerá automaticamente

### 2. **Instalação**

- Clique em "Instalar" no banner
- Confirme a instalação no prompt do sistema
- O app será instalado como um app nativo

### 3. **Funcionalidades Offline**

- Navegue pelas páginas em cache
- Consulte seus agendamentos offline
- Os dados serão sincronizados quando online

### 4. **Notificações**

- Permita notificações quando solicitado
- Receba lembretes de agendamentos
- Configure preferências de notificação

## Recursos Técnicos

### **Cache Strategies**

- **Páginas**: `stale-while-revalidate`
- **APIs**: `network-first` com fallback offline
- **Recursos**: `cache-first` para performance

### **Service Worker Lifecycle**

1. **Install**: Cache de recursos essenciais
2. **Activate**: Limpeza de caches antigos
3. **Fetch**: Interceptação e cache de requisições
4. **Sync**: Sincronização em background

### **Notificações**

- **Lembretes**: Agendados 1 hora antes
- **Push**: Para atualizações importantes
- **Ações**: Ver e fechar rapidamente

## Compatibilidade

### **Navegadores Suportados**

- ✅ Chrome 67+
- ✅ Firefox 67+
- ✅ Safari 11.1+
- ✅ Edge 79+

### **Dispositivos**

- ✅ Android (Chrome, Firefox, Samsung Internet)
- ✅ iOS (Safari, Chrome)
- ✅ Desktop (todos os navegadores modernos)

## Desenvolvimento

### **Comandos Úteis**

```bash
# Verificar status PWA
chrome://inspect/#service-workers

# Testar offline
DevTools > Application > Service Workers

# Verificar manifest
DevTools > Application > Manifest
```

### **Debug PWA**

- **Service Worker**: DevTools > Application
- **Cache**: DevTools > Application > Storage
- **Manifest**: DevTools > Application > Manifest
- **Lighthouse**: Auditar PWA score

## Otimizações

### **Performance**

- Cache inteligente de recursos
- Lazy loading de componentes
- Compressão de assets
- Service Worker otimizado

### **UX**

- Feedback visual de status
- Indicadores de conectividade
- Transições suaves
- Gestos nativos

### **Acessibilidade**

- Suporte a leitores de tela
- Navegação por teclado
- Contraste adequado
- Textos descritivos

## Troubleshooting

### **Problemas Comuns**

#### App não instala

- Verificar se HTTPS está ativo
- Confirmar se Service Worker está registrado
- Verificar permissões do navegador

#### Cache não funciona

- Limpar cache do navegador
- Verificar Service Worker no DevTools
- Confirmar estratégias de cache

#### Notificações não aparecem

- Verificar permissões no sistema
- Confirmar registro do Service Worker
- Testar em modo incógnito

### **Logs e Debug**

```javascript
// Verificar status PWA
console.log("PWA Status:", navigator.serviceWorker.controller);

// Verificar cache
caches.keys().then((keys) => console.log("Caches:", keys));

// Testar notificações
new Notification("Teste", { body: "Teste de notificação" });
```

## Roadmap

### **Próximas Funcionalidades**

- [ ] **Push notifications** para promoções
- [ ] **Background sync** avançado
- [ ] **Offline-first** para agendamentos
- [ ] **Geolocalização** para barbearias próximas
- [ ] **Pagamento offline** com sincronização

### **Melhorias Técnicas**

- [ ] **Workbox** para cache avançado
- [ ] **IndexedDB** para dados offline
- [ ] **Web Push API** para notificações
- [ ] **Background Fetch** para downloads

## Suporte

Para dúvidas técnicas ou problemas com o PWA:

- Verificar logs do console
- Consultar DevTools > Application
- Testar em diferentes dispositivos
- Verificar compatibilidade do navegador

---

**BarberApp Cliente PWA** - Experiência mobile nativa para seus clientes! 🚀✂️
