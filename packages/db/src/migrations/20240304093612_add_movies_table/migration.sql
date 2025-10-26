-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "genres" TEXT[],
    "imdbId" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "rating" DECIMAL(3,1) NOT NULL,
    "releaseDate" DATE NOT NULL,
    "runtime" INTEGER NOT NULL,
    "tagline" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "tmdbPosterPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdbId_key" ON "Movie"("imdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");
