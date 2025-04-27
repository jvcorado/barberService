"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

interface CreateBookingParams {
  serviceId: string;
  date: Date;
}

export const createBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("User not authenticated");
  }

  await db.booking.create({
    data: { ...params, userId: (user.user as any).id },
  });

  revalidatePath("/barbershops/[id]");
  revalidatePath("/bookings");
};
