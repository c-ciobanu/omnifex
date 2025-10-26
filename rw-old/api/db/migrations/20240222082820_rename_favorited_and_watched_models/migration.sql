/*
  Warnings:

  - You are about to drop the `Favorited` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Watched` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorited" DROP CONSTRAINT "Favorited_userId_fkey";

-- DropForeignKey
ALTER TABLE "Watched" DROP CONSTRAINT "Watched_userId_fkey";

-- DropTable
DROP TABLE "Favorited";

-- DropTable
DROP TABLE "Watched";

-- CreateTable
CREATE TABLE "FavoritedMovie" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FavoritedMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchedMovie" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WatchedMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoritedMovie_tmdbId_userId_key" ON "FavoritedMovie"("tmdbId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchedMovie_tmdbId_userId_key" ON "WatchedMovie"("tmdbId", "userId");

-- AddForeignKey
ALTER TABLE "FavoritedMovie" ADD CONSTRAINT "FavoritedMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
