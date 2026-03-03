-- AlterTable
ALTER TABLE `players` ADD COLUMN `classLevel` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `classXp` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `isEvolved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastActiveUsed` DATETIME(3) NULL,
    ADD COLUMN `playerClass` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `password` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `player_purchases` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `itemType` VARCHAR(191) NOT NULL,
    `purchasedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,

    INDEX `player_purchases_userId_idx`(`userId`),
    UNIQUE INDEX `player_purchases_userId_itemId_key`(`userId`, `itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `active_boosts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `boostType` VARCHAR(191) NOT NULL,
    `multiplier` DOUBLE NOT NULL DEFAULT 1.0,
    `activatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `active_boosts_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_equipment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `activeFrame` VARCHAR(191) NULL,
    `activeTitle` VARCHAR(191) NULL,
    `activeAvatar` VARCHAR(191) NULL,
    `activeTheme` VARCHAR(191) NULL,
    `activePet` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `player_equipment_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
