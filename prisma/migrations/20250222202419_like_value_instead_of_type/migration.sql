/*
  Warnings:

  - You are about to drop the column `type` on the `app_like` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_like" DROP COLUMN "type",
ADD COLUMN     "value" INTEGER NOT NULL DEFAULT 1;
