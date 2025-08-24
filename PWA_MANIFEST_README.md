# Personalização do Manifesto PWA

## Como Funciona

O sistema agora permite que cada barbearia tenha seu próprio nome personalizado quando o site for adicionado ao dispositivo como PWA.

## Estrutura dos Arquivos

### 1. Manifesto Estático (`/public/manifest.json`)

- Serve como fallback padrão
- Nome genérico: "BarberApp"
- Usado na página inicial e outras páginas

### 2. API de Manifesto Dinâmico (`/api/manifest`)

- Gera manifesto personalizado baseado no ID da barbearia
- Busca nome e descrição da barbearia no banco de dados
- Retorna JSON com `Content-Type: application/manifest+json`

### 3. Componente DynamicManifest

- Atualiza dinamicamente o link do manifesto
- Personaliza o título da página
- Atualiza meta tags para Apple Web App
- Restaura configurações padrão ao sair da página

## Como Usar

### Na Página da Barbearia

```tsx
import { DynamicManifest } from "@/components/dynamic-manifest";

// No componente da página
<DynamicManifest barbershopId={params.id} barbershopName={barbershop.name} />;
```

### Resultado

- **Antes**: "BarberApp" (nome genérico)
- **Depois**: "Nome da Barbearia" (nome personalizado)

## URLs dos Manifestos

- **Padrão**: `/manifest.json`
- **Personalizado**: `/api/manifest?id={barbershopId}`

## Cache e Performance

- Manifesto dinâmico tem cache de 1 hora
- Fallback automático em caso de erro
- Restauração automática ao navegar entre páginas

## Compatibilidade

- ✅ Chrome/Edge (Android)
- ✅ Safari (iOS)
- ✅ Firefox
- ✅ Samsung Internet
- ✅ Opera
