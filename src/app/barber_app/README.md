# Barber App - Aplicativo Mobile para Barbearias

## Visão Geral

O Barber App é uma aplicação mobile desenvolvida em Next.js que oferece duas versões:

1. **App do Barbeiro**: Interface para o proprietário da barbearia gerenciar seu negócio
2. **App do Cliente**: Interface para clientes agendarem serviços

## Funcionalidades

### App do Barbeiro (`/barber_app`)

- Visualização do perfil da barbearia
- Estatísticas de agendamentos
- Galeria de fotos
- Informações de contato e localização
- Acesso ao dashboard web
- Configurações personalizáveis

### App do Cliente (`/barber_app/client?id={barbershopId}`)

- Visualização do perfil da barbearia
- Lista de serviços disponíveis
- Agendamento de serviços com:
  - Seleção de serviço
  - Escolha de data (a partir de amanhã)
  - Seleção de horário (9h às 18h)
  - Confirmação do agendamento
- Histórico de agendamentos do usuário
- Contatos diretos (telefone e WhatsApp)

## Como Usar

### Para Barbeiros

1. Acesse `/barber_app` estando logado
2. Use o menu lateral para navegar entre funcionalidades
3. Acesse o dashboard web para gerenciamento completo
4. Configure cores e personalização

### Para Clientes

1. Acesse `/barber_app/client?id={ID_DA_BARBEARIA}`
2. Visualize serviços disponíveis
3. Clique em "Agendar" no serviço desejado
4. Siga o processo de 4 etapas:
   - Escolha o serviço
   - Selecione a data
   - Escolha o horário
   - Confirme o agendamento

## Estrutura de Arquivos

```
src/app/barber_app/
├── components/
│   └── barber-app-layout.tsx    # Layout principal do app
├── client/
│   ├── layout.tsx               # Layout da versão cliente
│   ├── page.tsx                 # Página principal do cliente
│   └── book/
│       └── page.tsx             # Página de agendamento
├── config/
│   └── page.tsx                 # Configurações da barbearia
├── layout.tsx                   # Layout do barber app
├── page.tsx                     # Página principal (versão barbeiro)
└── README.md                    # Esta documentação
```

## Tecnologias Utilizadas

- **Next.js 14** com App Router
- **TypeScript** para tipagem
- **Tailwind CSS** para estilização
- **ShadCN/UI** para componentes
- **Prisma** para banco de dados
- **NextAuth** para autenticação
- **date-fns** para manipulação de datas
- **Sonner** para notificações

## Personalização

O app suporta personalização de cores através das configurações da barbearia:

- `primaryColor`: Cor principal
- `secondaryColor`: Cor secundária
- `backgroundColor`: Cor de fundo
- `textColor`: Cor do texto

## API Endpoints

- `GET /api/barbershops/[id]`: Busca informações da barbearia
- `POST /api/bookings`: Cria novo agendamento (via action)

## Considerações de UX

- Interface mobile-first responsiva
- Navegação intuitiva com steps progressivos
- Validação de horários disponíveis
- Feedback visual para todas as ações
- Cores personalizáveis por barbearia
- Botões de ação fixos para fácil acesso

## Próximas Funcionalidades

- Notificações push para lembretes
- Sistema de avaliações
- Pagamento integrado
- Histórico completo de agendamentos
- Filtros por data e serviço
- Integração com calendário do usuário
