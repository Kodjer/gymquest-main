-- AlterTable
ALTER TABLE `quests` ADD COLUMN `nodeId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `quests_userId_nodeId_idx` ON `quests`(`userId`, `nodeId`);
