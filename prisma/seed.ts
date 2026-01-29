import { PrismaClient } from '@prisma/client';
import { admin } from './data/admin';

const prisma = new PrismaClient();

(async () => {
  await prisma.admin.create({
    data: admin,
  });
  console.log(1);
})()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });