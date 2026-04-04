import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const result = await prisma.user.deleteMany({});
console.log(`✅ Удалено пользователей: ${result.count}`);

await prisma.$disconnect();
