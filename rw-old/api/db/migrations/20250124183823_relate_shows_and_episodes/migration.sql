/*
  Warnings:

  - Added the required column `showId` to the `ShowEpisode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowEpisode" ADD COLUMN     "showId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ShowEpisode" ADD CONSTRAINT "ShowEpisode_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
