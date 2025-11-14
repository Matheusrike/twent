/*
  Warnings:

  - You are about to drop the column `sale_number` on the `sale` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Sale_sale_number_key` ON `sale`;

-- AlterTable
ALTER TABLE `sale` DROP COLUMN `sale_number`;
