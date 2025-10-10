/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Store_email_key` ON `Store`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Store_phone_key` ON `Store`(`phone`);
