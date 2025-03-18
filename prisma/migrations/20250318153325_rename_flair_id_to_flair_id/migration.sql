/*
  Warnings:

  - You are about to drop the column `flairId` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "flairId",
ADD COLUMN     "flair_id" TEXT;
