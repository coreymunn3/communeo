/*
  Warnings:

  - Changed the type of `type` on the `post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "post_type" AS ENUM ('text', 'image', 'link');

-- AlterTable
ALTER TABLE "post" DROP COLUMN "type",
ADD COLUMN     "type" "post_type" NOT NULL;
