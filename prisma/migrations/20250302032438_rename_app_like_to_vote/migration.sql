/*
  Warnings:

  - You are about to drop the `app_like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "app_like" DROP CONSTRAINT "app_like_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "app_like" DROP CONSTRAINT "app_like_post_id_fkey";

-- DropForeignKey
ALTER TABLE "app_like" DROP CONSTRAINT "app_like_user_id_fkey";

-- DropTable
DROP TABLE "app_like";

-- CreateTable
CREATE TABLE "vote" (
    "id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,
    "value" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vote_user_id_post_id_comment_id_key" ON "vote"("user_id", "post_id", "comment_id");

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
