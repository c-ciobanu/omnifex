-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "director" TEXT,
ADD COLUMN     "originalLanguage" TEXT,
ADD COLUMN     "originalTitle" TEXT,
ALTER COLUMN "tagline" DROP NOT NULL;
