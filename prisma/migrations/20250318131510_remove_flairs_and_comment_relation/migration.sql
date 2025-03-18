/*
  Warnings:

  - You are about to drop the column `commentId` on the `flair` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "flair" DROP CONSTRAINT "flair_commentId_fkey";

-- AlterTable
ALTER TABLE "flair" DROP COLUMN "commentId";
