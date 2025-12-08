/*
  Warnings:

  - You are about to drop the column `cash_session_id` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the `CashRegister` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CashSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CashRegister" DROP CONSTRAINT "CashRegister_store_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CashSession" DROP CONSTRAINT "CashSession_cash_register_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CashSession" DROP CONSTRAINT "CashSession_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sale" DROP CONSTRAINT "Sale_cash_session_id_fkey";

-- AlterTable
ALTER TABLE "public"."Sale" DROP COLUMN "cash_session_id";

-- DropTable
DROP TABLE "public"."CashRegister";

-- DropTable
DROP TABLE "public"."CashSession";

-- DropEnum
DROP TYPE "public"."CashSessionStatus";
