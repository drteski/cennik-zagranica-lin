import prisma from "@/db";
import { matchPath } from "@/lib/utils";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Password from "@/components/Password";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CarbonChevronLeft(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 32 32"
			{...props}
		>
			<path fill="currentColor" d="M10 16L20 6l1.4 1.4l-8.6 8.6l8.6 8.6L20 26z"></path>
		</svg>
	);
}

const LangPage = async ({ params }) => {
	if (await !matchPath(params.lang)) return notFound();
	const country = await prisma.country.findFirst({
		where: {
			iso: params.lang,
		},
	});

	const cookieStore = cookies();
	const cookieLang = cookieStore.get("lang")?.value || "";
	const cookieAuth = cookieStore.get("authorized")?.value
		? JSON.parse(cookieStore.get("authorized")?.value)
		: false;

	if (!cookieAuth)
		return (
			<main>
				<Password lang={params.lang} />
			</main>
		);
	if (cookieLang !== params.lang)
		return (
			<main>
				<Password lang={params.lang} />
			</main>
		);

	let products = await prisma.product.findMany({
		include: {
			titles: true,
			brand: true,
		},
	});

	const preparedProducts = await Promise.all(
		products
			.filter((product) => product.titles.length !== 0 && product.sku !== "")
			.map((product) => ({
				...product,
				titles: product.titles.filter((title) => title.lang === params.lang),
			}))
			.map(async (prod) => {
				if (prod.titles.length === 0) return;
				const { variantId, sku, ean, brand } = prod;
				return {
					variantId,
					sku,
					ean,
					brand: brand?.name,
					name: prod.titles[0].name,
					lang: prod.titles[0].lang,
					price: {
						newPrice: prod.titles[0].newPrice,
						oldPrice: prod.titles[0].oldPrice,
						priceDifference: prod.titles[0].priceDifference,
					},
				};
			})
			.filter(Boolean),
	);
	const productWithPriceDifference = preparedProducts
		.filter(Boolean)
		.filter(
			(product) =>
				product.price.priceDifference > 0 || (product.price.priceDifference < 0 && true),
		);
	const productWithoutPriceDifference = preparedProducts
		.filter(Boolean)
		.filter((product) => product.price.priceDifference === 0 && true);

	// Get all the brands for the filter
	const brands = await prisma.brand.findMany({
		select: {
			name: true,
		},
	});

	return (
		<main className="p-10 pt-24 pb-44">
			<div className="flex gap-4 items-center w-full mb-4">
				<Button asChild variant="destructive">
					<Link href="/">
						<CarbonChevronLeft className="mr-5" />
						Back
					</Link>
				</Button>
				<h1 className="text-3xl uppercase font-bold">{country.name}</h1>
			</div>
			<DataTable
				data={[...productWithPriceDifference, ...productWithoutPriceDifference]}
				brands={brands}
				lang={params.lang}
				country={country}
			/>
		</main>
	);
};

export default LangPage;
