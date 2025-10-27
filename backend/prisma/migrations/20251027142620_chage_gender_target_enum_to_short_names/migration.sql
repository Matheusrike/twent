/*
  Warnings:

  - The values [MASCULINE,FEMININE] on the enum `Collection_target_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Collection` MODIFY `target_gender` ENUM('UNISEX', 'MALE', 'FEMALE') NOT NULL DEFAULT 'UNISEX';
