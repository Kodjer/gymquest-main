const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const onboardingData = await prisma.onboardingData.findMany({
      include: {
        player: {
          include: {
            user: true,
          },
        },
      },
    });

    console.log("\nДанные onboarding:");
    onboardingData.forEach((data) => {
      console.log(`\nПользователь: ${data.player.user.email}`);
      console.log(`  workoutPreference: ${data.workoutPreference}`);
      console.log(`  fitnessExperience: ${data.fitnessExperience}`);
      console.log(`  availableTime: ${data.availableTime}`);
    });
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
