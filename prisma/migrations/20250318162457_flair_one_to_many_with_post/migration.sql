/*
  Warnings:

  - You are about to drop the `_PostFlairs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PostFlairs" DROP CONSTRAINT "_PostFlairs_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostFlairs" DROP CONSTRAINT "_PostFlairs_B_fkey";

-- DropTable
DROP TABLE "_PostFlairs";

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_flair_id_fkey" FOREIGN KEY ("flair_id") REFERENCES "flair"("id") ON DELETE SET NULL ON UPDATE CASCADE;
