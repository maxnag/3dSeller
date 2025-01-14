-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wix_id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `inventory` INTEGER NOT NULL,
    `picture` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Products_sku_key`(`sku`),
    UNIQUE INDEX `Products_sku_key`(`wix_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
