/*
  Warnings:

  - You are about to drop the column `case_diameter` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `case_material` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `movement_type` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `water_resistance` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_id]` on the table `ProductImage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `case_diameter`,
    DROP COLUMN `case_material`,
    DROP COLUMN `movement_type`,
    DROP COLUMN `water_resistance`;

-- CreateIndex
CREATE UNIQUE INDEX `ProductImage_public_id_key` ON `ProductImage`(`public_id`);
