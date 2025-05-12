import { db } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function handleIncomingMessage(
  message: string,
  phone: string,
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Você é um assistente de uma barbearia. Sempre responda de forma educada e direta. Peça serviço e horário, se faltar algo.`,
      },
      { role: "user", content: message },
    ],
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
            },
            required: ["serviceName", "dateTime", "userPhone"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const toolCall = completion.choices[0].message.tool_calls?.[0];

  if (toolCall?.function?.name === "createBooking") {
    const args = JSON.parse(toolCall.function.arguments);
    const { serviceName, dateTime, userPhone } = args;

    // Tenta encontrar usuário pelo número
    let user = await db.user.findFirst({ where: { phone: userPhone } });

    // Se não existir, cria automaticamente
    if (!user) {
      user = await db.user.create({
        data: {
          phone: userPhone,
          name: "Cliente WhatsApp",
          email: `${userPhone}@viawhatsapp.com`,
        },
      });
    }

    // Busca serviço
    const service = await db.barbershopService.findFirst({
      where: {
        name: { equals: serviceName, mode: "insensitive" },
      },
    });

    if (!service) {
      return `Serviço "${serviceName}" não encontrado. Verifique o nome e tente novamente.`;
    }

    // Cria o agendamento
    await db.booking.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        barberShopId: service.barberShopId,
        date: new Date(dateTime),
      },
    });

    const formatted = new Date(dateTime).toLocaleString("pt-BR");
    return `✅ Agendamento confirmado para *${service.name}* em *${formatted}*.`;
  }

  return (
    completion.choices[0].message.content ??
    "Desculpe, não entendi. Pode repetir com mais detalhes?"
  );
}
