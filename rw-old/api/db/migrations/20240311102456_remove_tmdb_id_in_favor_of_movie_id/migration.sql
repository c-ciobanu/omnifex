/*
  Warnings:

  - You are about to drop the column `tmdbId` on the `FavoritedMovie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FavoritedMovie` table. All the data in the column will be lost.
  - You are about to drop the column `tmdbId` on the `WatchedMovie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WatchedMovie` table. All the data in the column will be lost.
  - You are about to drop the column `tmdbId` on the `WatchlistItemMovie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WatchlistItemMovie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[movieId,userId]` on the table `FavoritedMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId,userId]` on the table `WatchedMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId,userId]` on the table `WatchlistItemMovie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `movieId` to the `FavoritedMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movieId` to the `WatchedMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movieId` to the `WatchlistItemMovie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FavoritedMovie_tmdbId_userId_key";

-- DropIndex
DROP INDEX "WatchedMovie_tmdbId_userId_key";

-- DropIndex
DROP INDEX "WatchlistItemMovie_tmdbId_userId_key";

-- AlterTable
ALTER TABLE "FavoritedMovie" DROP COLUMN "tmdbId",
DROP COLUMN "updatedAt",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WatchedMovie" DROP COLUMN "tmdbId",
DROP COLUMN "updatedAt",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WatchlistItemMovie" DROP COLUMN "tmdbId",
DROP COLUMN "updatedAt",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FavoritedMovie_movieId_userId_key" ON "FavoritedMovie"("movieId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchedMovie_movieId_userId_key" ON "WatchedMovie"("movieId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItemMovie_movieId_userId_key" ON "WatchlistItemMovie"("movieId", "userId");

-- AddForeignKey
ALTER TABLE "FavoritedMovie" ADD CONSTRAINT "FavoritedMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItemMovie" ADD CONSTRAINT "WatchlistItemMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
