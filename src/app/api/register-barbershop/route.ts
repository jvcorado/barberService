// app/api/register-barbershop/route.ts
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { name, address, phones, description, imageUrl } = body;

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.admin) {
      return NextResponse.json(
        { error: "User already owns a barbershop" },
        { status: 400 },
      );
    }

    await db.barberShop.create({
      data: {
        name,
        address,
        phones,
        description,
        imageUrl,
        owner: {
          connect: { id: user.id },
        },
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { admin: true },
    });

    return NextResponse.json(
      { message: "Barbershop registered successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
