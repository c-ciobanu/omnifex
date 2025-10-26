-- CreateTable
CREATE TABLE "WatchedEpisode" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,

    CONSTRAINT "WatchedEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchedEpisode_userId_episodeId_key" ON "WatchedEpisode"("userId", "episodeId");

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "ShowSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "ShowEpisode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
