export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(request) {
  const { pass, lang } = await request.json();
  const password = await prisma.password.findFirst({
    where: {
      country: {
        is: {
          iso: lang,
        },
      },
    },
  });
  const authorized = password.password === pass;
  return NextResponse.json({ authorized });
}
