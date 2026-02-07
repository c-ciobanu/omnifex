/*
  Warnings:

  - A unique constraint covering the columns `[aniListId]` on the table `manga` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mangaBakaId]` on the table `manga` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mangaUpdatesId]` on the table `manga` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[malId]` on the table `manga` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "manga" ADD COLUMN     "malId" TEXT,
ADD COLUMN     "mangaBakaId" TEXT,
ALTER COLUMN "mangaDexId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "manga_aniListId_key" ON "manga"("aniListId");

-- CreateIndex
CREATE UNIQUE INDEX "manga_mangaBakaId_key" ON "manga"("mangaBakaId");

-- CreateIndex
CREATE UNIQUE INDEX "manga_mangaUpdatesId_key" ON "manga"("mangaUpdatesId");

-- CreateIndex
CREATE UNIQUE INDEX "manga_malId_key" ON "manga"("malId");
