import Link from "next/link";
import prisma from "@/db";

const NotFound = async () => {
	const countries = await prisma.country.findMany({});
	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<h1 className="text-7xl font-bold mb-4">404</h1>
			<p className="uppercase mb-20">Page not found</p>
			<p className="mb-4 uppercase font-medium">Available pages:</p>
			<div className="grid grid-cols-4 items-center gap-2">
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

export default NotFound;
