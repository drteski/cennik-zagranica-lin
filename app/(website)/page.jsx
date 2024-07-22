import Link from "next/link";
import prisma from "@/db";

const BasePage = async () => {
	const countries = await prisma.country.findMany({});
	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<h1 className="text-7xl font-bold mb-8">Prices Podlasiak</h1>
			<p className="mb-4 uppercase font-medium">Countries:</p>
			<div className="grid grid-cols-6 items-center gap-2">
				{countries.map((country) => (
					<Link
						className="py-2 px-4 text-center hover:underline"
						key={country}
						href={`/${country.iso}`}
					>
						{country.name}
					</Link>
				))}
			</div>
		</div>
	);
};

export default BasePage;
