// app/api/upload/route.ts
import { NextRequest } from "next/server";
import { bucket } from "@/lib/firebase-admin";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; // necessário para usar stream
export const dynamic = "force-dynamic"; // para desabilitar cache

export async function POST(req: NextRequest): Promise<Response> {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "Arquivo não enviado" }), {
      status: 400,
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = `barbearias/${uuidv4()}_${file.name}`;
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    metadata: { contentType: file.type },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      console.error("Erro no blob:", err);
      reject(
        new Response(JSON.stringify({ error: "Erro no upload" }), {
          status: 500,
        }),
      );
    });

    blobStream.on("finish", async () => {
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-01-2030",
      });

      resolve(new Response(JSON.stringify({ url }), { status: 200 }));
    });

    blobStream.end(buffer);
  });
}
