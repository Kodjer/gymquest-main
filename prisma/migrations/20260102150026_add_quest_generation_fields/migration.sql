/*
  Warnings:

  - Added the required column `category` to the `quests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `players` ADD COLUMN `completedQuests` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `lastQuestGenerated` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `quests` ADD COLUMN `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `completedAt` DATETIME(3) NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `isGenerated` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX `quests_userId_status_idx` ON `quests`(`userId`, `status`);
