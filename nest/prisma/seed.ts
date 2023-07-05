import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  const passwordUser1 = await hash("jmolvaut", roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {
      password: passwordUser1,
      picture: "",
    },
    create: {
      email: "jmolvaut@student.42.fr",
      firstName: "Jeremy",
      lastName: "Molvaut",
      picture: "",
      password: passwordUser1
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
