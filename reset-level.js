const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "ssazonov228@gmail.com" },
      include: { player: true },
    });

    console.log("Текущий уровень:", user.player.level);
    console.log("XP:", user.player.xp);

    // Сброс уровня до 1
    await prisma.player.update({
      where: { id: user.player.id },
      data: {
        level: 1,
        xp: 0,
      },
    });

    console.log("\n✅ Уровень сброшен до 1");
    console.log("Теперь квесты будут только ЛЕГКИЕ");

    await prisma.$disconnect();
  } catch (error) {
    console.error("Ошибка:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
