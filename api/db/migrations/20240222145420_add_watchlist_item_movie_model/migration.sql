-- CreateTable
CREATE TABLE "WatchlistItemMovie" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WatchlistItemMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItemMovie_tmdbId_userId_key" ON "WatchlistItemMovie"("tmdbId", "userId");

-- AddForeignKey
ALTER TABLE "WatchlistItemMovie" ADD CONSTRAINT "WatchlistItemMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
