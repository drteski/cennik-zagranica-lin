import { notifyClient } from "@/services/sendNotification";

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { config } from "@/config/config";

export async function POST(request) {
  const { lang } = await request.json();
  const country = await prisma.country.findFirst({ where: { iso: lang } });

  await Promise.all(data);
  return NextResponse.json(country);
}
