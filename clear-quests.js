const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    // Получаем пользователя
    const user = await prisma.user.findFirst({
      include: {
        player: {
          include: {
            onboardingData: true,
          },
        },
      },
    });

    if (!user) {
      console.log("Пользователь не найден");
      return;
    }

    console.log(`\nГенерация квестов для: ${user.email}`);
    console.log(
      `Предпочтения: ${user.player.onboardingData.workoutPreference}`
    );

    // Удаляем старые квесты
    const deleted = await prisma.quest.deleteMany({
      where: { userId: user.id },
    });
    console.log(`Удалено старых квестов: ${deleted.count}`);

    // Теперь пользователь должен нажать кнопку "Сгенерировать неделю" в интерфейсе
    console.log(
      '\n✅ Старые квесты удалены. Теперь нажмите "Сгенерировать неделю" в приложении.'
    );
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
