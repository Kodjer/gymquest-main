-- AlterTable
ALTER TABLE `players` ADD COLUMN `currentWeek` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `weekStartDate` DATETIME(3) NULL;
