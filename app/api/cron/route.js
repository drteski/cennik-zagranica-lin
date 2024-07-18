import { NextResponse } from "next/server";
import prisma from "@/db";

const axios = require("axios");

// const cronJob = async () => {
//   await axios
//     .get("/api/products")
//     .then((res) => console.log(res))
//     .catch((e) => console.log(e));
//   await axios
//     .get("/api/mailing")
//     .then((res) => console.log(res))
//     .catch((e) => console.log(e));
// };
//
// cronJob();

export async function GET() {
  const products = await prisma.productTitle.findMany();

  await Promise.all(products.map(async (product) => await prisma.productTitle.delete({ where: { id: product.id } })));
  return NextResponse.json({ message: "Zaktualizowano produkty." });
}
