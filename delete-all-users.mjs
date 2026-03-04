import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete in correct order (foreign key constraints)
  const xp = await prisma.xpHistory.deleteMany({});
  console.log('XpHistory deleted:', xp.count);
  
  const purchases = await prisma.purchase.deleteMany({}).catch(() => ({ count: 0 }));
  console.log('Purchases deleted:', purchases.count);
  
  const equipment = await prisma.equipment.deleteMany({}).catch(() => ({ count: 0 }));
  console.log('Equipment deleted:', equipment.count);
  
  const quests = await prisma.quest.deleteMany({});
  console.log('Quests deleted:', quests.count);
  
  const players = await prisma.player.deleteMany({});
  console.log('Players deleted:', players.count);

  // NextAuth tables
  try {
    await prisma.$executeRawUnsafe('DELETE FROM accounts');
    await prisma.$executeRawUnsafe('DELETE FROM sessions');
    await prisma.$executeRawUnsafe('DELETE FROM verification_tokens');
    console.log('Auth tables cleared');
  } catch (e) {
    console.log('Auth tables cleanup:', e.message);
  }

  const users = await prisma.user.deleteMany({});
  console.log('Users deleted:', users.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
