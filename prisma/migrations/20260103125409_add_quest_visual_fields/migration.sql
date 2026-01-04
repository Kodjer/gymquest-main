-- AlterTable
ALTER TABLE `quests` ADD COLUMN `instructions` TEXT NULL,
    ADD COLUMN `stepByStep` TEXT NULL,
    ADD COLUMN `tip` TEXT NULL,
    ADD COLUMN `visualDemo` TEXT NULL;
