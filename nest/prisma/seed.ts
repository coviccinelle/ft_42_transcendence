import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export const roundsOfHashing = 10;

async function main() {
  const passwordUser1 = await hash("testpassword", roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {
      password: passwordUser1,
    },
    create: {
      email: "test@test.com",
      firstName: "Test1",
      lastName: "TestNom",
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
