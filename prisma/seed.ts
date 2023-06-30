import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const user1 = await prisma.user.upsert({
		where: { id: 1 },
		update: {},
		create: {
			email: "jmolvaut@student.42.fr",
			nickname: "jmolvaut",
			firstName: "Jeremy",
			lastName: "Molvaut",
			password: "test"
		}
	});

	console.log({user1});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
