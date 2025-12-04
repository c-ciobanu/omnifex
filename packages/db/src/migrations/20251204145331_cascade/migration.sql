-- DropForeignKey
ALTER TABLE "public"."WatchedEpisode" DROP CONSTRAINT "WatchedEpisode_episodeId_fkey";

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "ShowEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
