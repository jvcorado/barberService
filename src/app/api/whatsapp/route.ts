import { NextRequest } from "next/server";
import { handleIncomingMessage } from "@/lib/agent/whatsappHandler";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    console.log("🔔 Nova mensagem recebida:");
    console.log(JSON.stringify(body, null, 2));

    const userMessage: string | null =
      body.message || body.body || body.Body || body.text?.message || null;

    const phone: string | null = body.phone || body.from || body.From || null;

    // Ignora mensagens que não sejam de texto
    if (!userMessage || !phone) {
      if (body.type !== "ReceivedCallback" || !body.text?.message) {
        return new Response(null, { status: 200 }); // silencioso
      }

      console.warn("❌ Dados incompletos recebidos. Abortando...");
      return new Response("Mensagem ou número ausente.", { status: 400 });
    }

    console.log(`📨 Mensagem: "${userMessage}"`);
    console.log(`📱 Número: ${phone}`);

    const reply = await handleIncomingMessage(userMessage, phone);
    console.log(`✅ Resposta do agente: "${reply}"`);

    // Endpoint Z-API (você pode usar variáveis de ambiente também)
    const zapiUrl = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

    const payload = {
      phone: phone.replace(/\D/g, ""), // limpa o número
      message: reply,
    };

    const zapiResponse = await fetch(zapiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Token": process.env.ZAPI_CLIENT_TOKEN || "",
      },
      body: JSON.stringify(payload),
    });

    const zapiData = await zapiResponse.json();

    console.log("📤 Resposta da Z-API:");
    console.log(JSON.stringify(zapiData, null, 2));

    return new Response(JSON.stringify({ reply, zapiData }), { status: 200 });
  } catch (error: any) {
    console.error("❌ Erro no webhook /api/whatsapp:", error);

    return new Response(
      JSON.stringify({ error: "Erro ao processar a requisição." }),
      { status: 500 },
    );
  }
};
