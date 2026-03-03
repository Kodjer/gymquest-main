const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const deleted = await prisma.quest.deleteMany({});
  console.log('Удалено квестов:', deleted.count);
  const updated = await prisma.player.updateMany({
    data: { currentWeek: 1, weekStartDate: new Date(), lastQuestGenerated: null }
  });
  console.log('Обновлено игроков:', updated.count);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
