const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkQuest() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "ssazonov228@gmail.com" },
    });

    const quest = await prisma.quest.findFirst({
      where: {
        userId: user.id,
        title: "Румынская тяга",
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        nodeId: true,
        xpReward: true,
      },
    });

    console.log("Quest from DB:");
    console.log(JSON.stringify(quest, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuest();
