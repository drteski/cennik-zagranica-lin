import { config } from "@/config/config";

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import fs from "fs";
import prisma from "@/db";

const dataPath = `${process.cwd().replace(/\\\\/g, "/")}/public/temp/data/`;

const processFile = (file, cb) => {
  return new Promise(async (resolve, reject) => {
    await fs.readFile(dataPath + file, "utf8", async (error, data) => {
      if (error) reject(error);
      resolve(await cb(JSON.parse(data)));
    });
  });
};

const processAliases = async (data) => {
  const upsertData = data.alias.map(async (item) => {
    return await prisma.alias.upsert({
      where: {
        id: parseInt(item.$id),
      },
      update: {
        name: item.$name,
      },
      create: {
        id: parseInt(item.$id),
        name: item.$name,
      },
    });
  });

  const insertedData = await Promise.all(upsertData);

  return console.log(`${insertedData.length} aliases processed`);
};

const processCategories = async (data) => {
  const upsertData = data.category.map(async (item) => {
    await prisma.category.upsert({
      where: {
        id: parseInt(item.$id),
      },
      update: {
        alias: parseInt(item.$alias),
        parent: parseInt(item.$parent),
        names: {
          create: item.name.map(({ $lang, $ }) => {
            return {
              lang: $lang,
              text: $,
            };
          }),
        },
      },
      create: {
        id: parseInt(item.$id),
        alias: parseInt(item.$alias),
        parent: parseInt(item.$parent),
        names: {
          create: item.name.map(({ $lang, $ }) => {
            return {
              lang: $lang,
              text: $,
            };
          }),
        },
      },
    });
  });
  const insertedData = await Promise.all(upsertData);

  return console.log(`${insertedData.length} categories processed`);
};

const processProducers = async (data) => {
  const upsertData = data.producer.map(async (item) => {
    await prisma.brand.upsert({
      where: { id: parseInt(item.$id) },
      update: {
        name: item.$name,
      },
      create: {
        id: parseInt(item.$id),
        name: item.$name,
      },
    });
  });
  const insertedData = await Promise.all(upsertData);

  return console.log(`${insertedData.length} producers processed`);
};
const processProducts = async (data) => {
  const products = data
    .map((product) => {
      const id = product.$id;
      const title = product.titles.title.map((text) => ({ lang: text.$lang, text: text.$ }));
      const weight = product.$weight;
      const brand = product.$producer;
      const freeTransport = product.$freeTransport === "true";
      const productVariant = product.variants.variant.length >= 0 ? product.variants.variant : [product.variants.variant];
      return productVariant.map((variant) => {
        const variantId = variant.$id;
        const sku = variant.$symbol;
        const ean = variant.$ean;
        const isActive = variant.$isActive === "true";
        const price = variant.sellPrice.length === 0 ? [] : variant.sellPrice.price.$gross ? [variant.sellPrice.price] : variant.sellPrice.price;
        return {
          id,
          title,
          variantId,
          sku,
          ean,
          isActive,
          price,
          weight,
          brand,
          freeTransport,
        };
      });
    })
    .flatMap((product) => product)
    .filter((product) => product.isActive === true)
    .filter(Boolean);
  const prices = products
    .map((product) => {
      const id = product.id;
      return product.title
        .map((title) => {
          const { lang, text } = title;

          const pricesParsed = product.price.map((price) => ({ tariff: parseInt(price["$tariff_strategy"]), gross: parseFloat(price["$gross"]) }));

          const prices = pricesParsed
            .map((price) => {
              const strategyIndex = config.tariff.findIndex((strategy) => strategy.tariff === price.tariff);
              if (strategyIndex !== -1) {
                if (config.tariff[strategyIndex].lang === lang) {
                  return { id: parseInt(id), lang, text, tariff: price.tariff, price: price.gross };
                }
              }
            })
            .filter(Boolean);
          if (prices.length !== 0) return prices;
        })
        .filter(Boolean)
        .flatMap((a) => a);
    })
    .filter(Boolean)
    .flatMap((a) => a);

  const upsertProducts = products.map(async (item) => {
    await prisma.product.upsert({
      where: {
        variantId: parseInt(item.variantId),
      },
      update: {
        productId: parseInt(item.id),
        active: item.isActive,
        weight: parseFloat(item.weight),
        brandId: parseInt(item.brand),
        variantId: parseInt(item.variantId),
        sku: item.sku,
        ean: item.ean,
        freeTransport: item.freeTransport,
      },
      create: {
        productId: parseInt(item.id),
        active: item.isActive,
        weight: parseFloat(item.weight),
        brandId: parseInt(item.brand),
        variantId: parseInt(item.variantId),
        sku: item.sku,
        ean: item.ean,
        freeTransport: item.freeTransport,
      },
    });
  });
  const upsertPrices = prices.map(async (item) => {
    const currentProductData = await prisma.productTitle.findFirst({
      where: {
        products: {
          some: {
            productId: item.id,
          },
        },
        name: item.text,
        lang: item.lang,
      },
      select: {
        id: true,
        newPrice: true,
      },
    });
    const existingProduct = await prisma.product.findFirst({ where: { productId: item.id } });
    console.log(existingProduct);
    if (currentProductData !== null) {
      await prisma.productTitle.update({
        where: {
          id: currentProductData.id,
        },
        data: {
          name: item.text === "" ? "---" : item.text,
          lang: item.lang,
          newPrice: item.price,
          oldPrice: currentProductData.newPrice,
          priceDifference: currentProductData.newPrice !== 0 ? item.price - currentProductData.newPrice : 0,
        },
      });
    } else {
      await prisma.productTitle.create({
        data: {
          name: item.text === "" ? "---" : item.text,
          lang: item.lang,
          newPrice: item.price,
          oldPrice: 0,
          priceDifference: 0,
          products: {
            connect: {
              id: existingProduct.id, // productId: item.id,
            },
          },
        },
      });
    }
  });
  const insertedProducts = await Promise.all(upsertProducts);
  const insertedPrices = await Promise.all(upsertPrices);

  return console.log(`${insertedProducts.length} products processed\n${insertedPrices.length} prices processed`);
};
// const processPrices = async (data) => {
//   const prices = data.map((product, index) => {
//     if (index === 0) console.log(product);
//     return;
//   });
//   const upsertData = prices.map(async (item) => {});
//   // const insertedData = await Promise.all(upsertData);
//   // return console.log(`${insertedData.length} products processed`);
// };

export async function GET() {
  const files = fs.readdirSync(dataPath);
  const productsFiles = files.filter((file) => file.match(/product-\d*/g));

  const dataToProces = files.map(async (file) => {
    const fileName = file.replace(".json", "").replace(/-\d*/g, "");
    switch (fileName) {
      case "aliases":
        await processFile(file, processAliases);
        break;
      case "categories":
        await processFile(file, processCategories);
        break;
      case "producers":
        await processFile(file, processProducers);
        break;
      case "product":
        await processFile(file, processProducts);
        break;
      default: {
        break;
      }
    }
  });

  await Promise.all(dataToProces);

  const filesToDelete = files.map(async (file) => await fs.unlink(`${dataPath}${file}`, (err) => console.log(err)));
  await Promise.all(filesToDelete);

  return NextResponse.json({ message: "Zaktualizowano produkty." });
}
