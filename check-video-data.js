const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const quest = await prisma.quest.findFirst({
      select: {
        title: true,
        difficulty: true,
        visualDemo: true,
      },
    });

    console.log("Sample quest:", JSON.stringify(quest, null, 2));

    if (quest?.visualDemo) {
      const demo = JSON.parse(quest.visualDemo);
      console.log("\n✅ Video data found!");
      console.log("Video type:", demo.type);
      console.log("Video URL:", demo.url);
    } else {
      console.log("\n❌ No video data in quest");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
