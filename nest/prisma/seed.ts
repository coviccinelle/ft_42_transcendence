import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { use } from 'passport';

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
      password: passwordUser1,
      matchHistory: {
        create: {
          result: 'WIN',
          otherPlayerId: 0,
          otherPlayerName: 'Bob',
          myScore: 5,
          otherScore: 3,
        }
      }
    }
  });

  const generalChannel = await prisma.channel.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'General',
      isGroup: true,
      isPublic: true,
      isPasswordProtected: false,
    },
  });
  
  const randomChannel = await prisma.channel.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Random',
      isGroup: true,
      isPublic: true,
      isPasswordProtected: false,
    },
  });

  const memberGeneral = await prisma.member.upsert({
    where: { id: 1 },
    update: {},
    create: {
      role: 'OWNER',
      user: {
        connect: { id: user1.id },
      },
      channel: {
        connect: { id: generalChannel.id },
      },
    },
  });

  const memberRandom = await prisma.member.upsert({
    where: { id: 2 },
    update: {},
    create: {
      role: 'OWNER',
      user: {
        connect: { id: user1.id },
      },
      channel: {
        connect: { id: randomChannel.id },
      },
    },
  });

  const message = await prisma.message.upsert({
    where: { id: 1 },
    update: {},
    create: {
      content: 'Hello world',
      author: {
        connect: { id: memberGeneral.id },
      },
      channel: {
        connect: { id: generalChannel.id },
      },
    },
  });

  console.log({ user1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
