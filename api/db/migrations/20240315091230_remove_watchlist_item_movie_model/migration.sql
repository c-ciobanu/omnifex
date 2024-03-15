/*
  Warnings:

  - You are about to drop the `WatchlistItemMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WatchlistItemMovie" DROP CONSTRAINT "WatchlistItemMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "WatchlistItemMovie" DROP CONSTRAINT "WatchlistItemMovie_userId_fkey";

-- DropTable
DROP TABLE "WatchlistItemMovie";
