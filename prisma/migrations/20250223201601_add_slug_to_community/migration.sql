/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `community` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `community` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "community" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "community_slug_key" ON "community"("slug");
