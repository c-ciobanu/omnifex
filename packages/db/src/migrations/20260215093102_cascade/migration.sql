-- DropForeignKey
ALTER TABLE "public"."ShowEpisode" DROP CONSTRAINT "ShowEpisode_seasonId_fkey";

-- AddForeignKey
ALTER TABLE "ShowEpisode" ADD CONSTRAINT "ShowEpisode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "ShowSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;
