/*
  Warnings:

  - You are about to drop the `WatchlistedMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WatchlistedMovie" DROP CONSTRAINT "WatchlistedMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "WatchlistedMovie" DROP CONSTRAINT "WatchlistedMovie_userId_fkey";

-- DropTable
DROP TABLE "WatchlistedMovie";

-- CreateTable
CREATE TABLE "ToWatchMovie" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ToWatchMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ToWatchMovie_movieId_userId_key" ON "ToWatchMovie"("movieId", "userId");

-- AddForeignKey
ALTER TABLE "ToWatchMovie" ADD CONSTRAINT "ToWatchMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToWatchMovie" ADD CONSTRAINT "ToWatchMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
