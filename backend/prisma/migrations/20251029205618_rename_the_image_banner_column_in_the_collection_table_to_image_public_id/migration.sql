/*
  Warnings:

  - You are about to drop the column `image_banner` on the `Collection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Collection` DROP COLUMN `image_banner`,
    ADD COLUMN `image_public_id` VARCHAR(191) NULL;
