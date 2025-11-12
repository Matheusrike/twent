/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document_number]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document_number` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `document_number` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_email_key` ON `Supplier`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_phone_key` ON `Supplier`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_document_number_key` ON `Supplier`(`document_number`);
