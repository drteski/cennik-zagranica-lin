import { notifyClient } from "@/services/sendNotification";

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { config } from "@/config/config";

export async function GET() {
  const data = config.translations.map(async (item) => {
    const country = await prisma.country.findFirst({ where: { iso: item.iso } });
    return await prisma.mailingList.create({
      data: {
        subject: item.subject,
        country: {
          connect: {
            id: country.id,
          },
        },
      },
    });
  });
  await Promise.all(data);
  return NextResponse.json({ messageSentTo: "poszło" });
}
