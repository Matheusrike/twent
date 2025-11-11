/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `model_number` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `CustomerFavorite` DROP FOREIGN KEY `CustomerFavorite_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryMovement` DROP FOREIGN KEY `InventoryMovement_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductPriceHistory` DROP FOREIGN KEY `ProductPriceHistory_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `SaleItem` DROP FOREIGN KEY `SaleItem_product_id_fkey`;

-- DropIndex
DROP INDEX `CustomerFavorite_product_id_fkey` ON `CustomerFavorite`;

-- DropIndex
DROP INDEX `Inventory_product_id_fkey` ON `Inventory`;

-- DropIndex
DROP INDEX `InventoryMovement_product_id_fkey` ON `InventoryMovement`;

-- DropIndex
DROP INDEX `ProductPriceHistory_product_id_fkey` ON `ProductPriceHistory`;

-- DropIndex
DROP INDEX `SaleItem_product_id_fkey` ON `SaleItem`;

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `images`,
    DROP COLUMN `model_number`,
    ADD PRIMARY KEY (`sku`);

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` CHAR(36) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `public_id` VARCHAR(191) NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`sku`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPriceHistory` ADD CONSTRAINT `ProductPriceHistory_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`sku`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`sku`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryMovement` ADD CONSTRAINT `InventoryMovement_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`sku`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`sku`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerFavorite` ADD CONSTRAINT `CustomerFavorite_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`sku`) ON DELETE RESTRICT ON UPDATE CASCADE;
