-- AlterTable
ALTER TABLE "Show" ALTER COLUMN "imdbId" DROP NOT NULL,
ALTER COLUMN "tmdbBackdropPath" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShowEpisode" ALTER COLUMN "airDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShowSeason" ALTER COLUMN "airDate" DROP NOT NULL,
ALTER COLUMN "tmdbPosterPath" DROP NOT NULL;
