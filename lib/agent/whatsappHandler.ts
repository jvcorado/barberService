import { db } from "@/lib/prisma";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const BARBERSHOP_PHONE = "5511939101265";

export async function handleIncomingMessage(
  message: string,
  clientPhone: string,
): Promise<string> {
  console.log("📞 Número do cliente:", clientPhone);
  console.log("🏪 Número da barbearia fixo:", BARBERSHOP_PHONE);

  const barber = await db.user.findFirst({
    where: { phone: BARBERSHOP_PHONE },
  });

  if (!barber) {
    console.warn("❌ Dono da barbearia não encontrado.");
    return "Não foi possível identificar a barbearia que recebeu a mensagem.";
  }

  const barbershop = await db.barberShop.findFirst({
    where: { ownerId: barber.id },
  });

  if (!barbershop) {
    console.warn("❌ Barbearia não encontrada.");
    return "Não foi possível localizar a barbearia associada.";
  }

  const services = await db.barbershopService.findMany({
    where: { barberShopId: barbershop.id },
  });

  const serviceList = services.map((s) => `• ${s.name}`).join("\n");

  let client = await db.user.findFirst({ where: { phone: clientPhone } });
  const isNewUser = !client;

  if (!client) {
    client = await db.user.create({
      data: {
        phone: clientPhone,
        name: "Cliente WhatsApp",
        email: `${clientPhone}@viawhatsapp.com`,
      },
    });
  }

  const history = await db.chatHistory.findMany({
    where: { phone: clientPhone },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
Você é um assistente da barbearia "${barbershop.name}".

Siga este fluxo:

1. Liste os serviços disponíveis:
${serviceList}

2. Pergunte qual serviço o cliente deseja.

3. Depois, pergunte o *nome completo* e o *e-mail*.

4. Em seguida, pergunte o *dia e horário* para o agendamento.

5. Quando tiver *serviço*, *nome*, *e-mail*, *telefone* (já disponível) e *data/hora*, use a função 'createBooking'.

Responda de forma clara, educada e direta. Se algo estiver faltando, pergunte apenas o que faltar.
      `,
    },
    ...history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.message,
    })),
    { role: "user", content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools: [
      {
        type: "function",
        function: {
          name: "createBooking",
          description: "Cria um novo agendamento",
          parameters: {
            type: "object",
            properties: {
              serviceName: { type: "string" },
              dateTime: { type: "string", format: "date-time" },
              userPhone: { type: "string" },
              userName: { type: "string" },
              userEmail: { type: "string" },
            },
            required: [
              "serviceName",
              "dateTime",
              "userPhone",
              "userName",
              "userEmail",
            ],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const toolCall = completion.choices[0].message.tool_calls?.[0];

  if (toolCall?.function?.name === "createBooking") {
    const args = JSON.parse(toolCall.function.arguments);
    const { serviceName, dateTime, userPhone, userName, userEmail } = args;

    if (
      isNewUser ||
      client.name === "Cliente WhatsApp" ||
      client.email.endsWith("@viawhatsapp.com")
    ) {
      await db.user.update({
        where: { id: client.id },
        data: {
          name: userName,
          email: userEmail,
        },
      });
    }

    const service = await db.barbershopService.findFirst({
      where: {
        name: { equals: serviceName, mode: "insensitive" },
        barberShopId: barbershop.id,
      },
    });

    if (!service) {
      return `O serviço "${serviceName}" não foi encontrado.`;
    }

    await db.booking.create({
      data: {
        userId: client.id,
        serviceId: service.id,
        barberShopId: barbershop.id,
        date: new Date(dateTime),
      },
    });

    await db.chatHistory.deleteMany({ where: { phone: clientPhone } });

    const formatted = new Date(dateTime).toLocaleString("pt-BR");
    return `✅ Agendamento confirmado para *${service.name}* em *${formatted}*.`;
  }

  const resposta =
    completion.choices[0].message.content ??
    "Desculpe, não entendi. Pode repetir?";
  await db.chatHistory.createMany({
    data: [
      { phone: clientPhone, role: "user", message },
      { phone: clientPhone, role: "assistant", message: resposta },
    ],
  });

  return resposta;
}
