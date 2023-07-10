import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { use } from "passport";

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  const passwordUser1 = await hash("jmolvaut", roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {
      password: passwordUser1
    },
    create: {
      email: "jmolvaut@student.42.fr",
      nickname: "jmolvaut",
      firstName: "Jeremy",
      lastName: "Molvaut",
      password: passwordUser1
    }
  });

  const generalChannel = await prisma.channel.upsert({
    where: {id: 1},
    update: {},
    create: {
      name: 'General',
      isGroup: true,
      isPublic: true
    }
  });

  const member = await prisma.member.upsert({
    where: {id: 1},
    update: {},
    create: {
      role: 'OWNER',
      left: false,
      user: {
        connect: { id: user1.id }
      },
      channel: {
        connect: { id: generalChannel.id }
      }
    }
  });

  const message = await prisma.message.upsert({
    where: {id: 1},
    update: {},
    create: {
      content: "Hello world",
      author: {
        connect: { id: member.id }
      },
      channel: {
        connect: { id: generalChannel.id }
      }
    }
  })

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
