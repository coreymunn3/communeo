/*
  Warnings:

  - You are about to drop the column `avatar` on the `app_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `app_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `app_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `app_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `app_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_user" DROP COLUMN "avatar",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");
