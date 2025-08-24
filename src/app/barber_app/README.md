# App do Barbeiro - Rota Mobile

Esta rota (`/barber_app`) é uma versão mobile/app da interface do barbeiro, otimizada para dispositivos móveis.

## 🚀 Funcionalidades

### 📱 **Interface Mobile-First**

- Design responsivo otimizado para smartphones
- Navegação por abas intuitiva
- Componentes touch-friendly
- Animações suaves para mobile

### 🗓️ **Agenda**

- Visualização dos agendamentos do dia
- Lista de clientes e serviços
- Horários organizados cronologicamente

### ✂️ **Serviços**

- Lista completa dos serviços oferecidos
- Preços e duração
- Gerenciamento dos serviços da barbearia

### ⏰ **Horários**

- Horários de funcionamento por dia da semana
- Interface clara e organizada

### 📊 **Relatórios**

- Estatísticas básicas da barbearia
- Contagem de agendamentos e serviços

### 👤 **Perfil**

- Informações da barbearia
- Foto, nome e descrição
- Endereço e contato

## 🛠️ **Tecnologias**

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **ShadCN/UI** para componentes
- **Lucide React** para ícones
- **PWA** ready com manifest.json

## 📱 **PWA Features**

- Manifest para instalação como app
- Meta tags para iOS/Android
- Viewport otimizado para mobile
- Touch-friendly interactions

## 🎨 **Design System**

### **Classes CSS Customizadas**

- `.mobile-tabs` - Navegação por abas otimizada
- `.mobile-tab` - Abas individuais com animações
- `.mobile-card` - Cards com sombras suaves
- `.touch-button` - Botões otimizados para touch
- `.animate-fade-in` - Animações de entrada
- `.animate-slide-up` - Animações de deslize

### **Cores e Temas**

- Tema escuro por padrão
- Cores primárias consistentes
- Contraste otimizado para mobile

## 🔧 **Como Usar**

1. **Acesso**: Navegue para `/barber_app`
2. **Autenticação**: Faça login como proprietário da barbearia
3. **Navegação**: Use as abas inferiores para navegar
4. **Menu**: Toque no ícone de menu para opções adicionais

## 📁 **Estrutura de Arquivos**

```
barber_app/
├── components/
│   ├── barber-app-layout.tsx    # Layout principal
│   └── notification-bell.tsx    # Componente de notificação
├── globals.css                  # Estilos mobile-otimizados
├── layout.tsx                   # Layout da rota
├── manifest.json                # Configuração PWA
├── page.tsx                     # Página principal
└── README.md                    # Esta documentação
```

## 🚀 **Próximos Passos**

- [ ] Implementar notificações push
- [ ] Adicionar funcionalidade offline
- [ ] Integrar com calendário nativo
- [ ] Adicionar gestos de swipe
- [ ] Implementar sincronização em tempo real

## 📱 **Compatibilidade**

- ✅ iOS Safari 12+
- ✅ Chrome Mobile 80+
- ✅ Firefox Mobile 75+
- ✅ Samsung Internet 10+
- ✅ Edge Mobile 80+

## 🎯 **Performance**

- Lazy loading de componentes
- Otimizações para mobile
- Animações CSS nativas
- Touch events otimizados
