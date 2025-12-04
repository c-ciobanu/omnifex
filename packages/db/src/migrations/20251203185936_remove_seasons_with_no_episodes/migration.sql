DELETE FROM "ShowSeason"
WHERE NOT EXISTS (
  SELECT 1 FROM "ShowEpisode" WHERE "ShowEpisode"."seasonId" = "ShowSeason".id
);
