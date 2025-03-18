/*
  Warnings:

  - You are about to drop the column `flairs` on the `community` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "community" DROP COLUMN "flairs";

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "flairId" TEXT;

-- CreateTable
CREATE TABLE "flair" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "commentId" TEXT,

    CONSTRAINT "flair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostFlairs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostFlairs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "flair_title_community_id_key" ON "flair"("title", "community_id");

-- CreateIndex
CREATE INDEX "_PostFlairs_B_index" ON "_PostFlairs"("B");

-- AddForeignKey
ALTER TABLE "flair" ADD CONSTRAINT "flair_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flair" ADD CONSTRAINT "flair_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostFlairs" ADD CONSTRAINT "_PostFlairs_A_fkey" FOREIGN KEY ("A") REFERENCES "flair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostFlairs" ADD CONSTRAINT "_PostFlairs_B_fkey" FOREIGN KEY ("B") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
