-- CreateTable
CREATE TABLE "Show" (
    "id" SERIAL NOT NULL,
    "creators" TEXT[],
    "genres" TEXT[],
    "imdbId" TEXT NOT NULL,
    "originalLanguage" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "rating" DECIMAL(3,1) NOT NULL,
    "tagline" TEXT,
    "title" TEXT NOT NULL,
    "tmdbBackdropPath" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "tmdbPosterPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowSeason" (
    "id" SERIAL NOT NULL,
    "airDate" DATE NOT NULL,
    "number" INTEGER NOT NULL,
    "overview" TEXT NOT NULL,
    "rating" DECIMAL(3,1) NOT NULL,
    "tmdbPosterPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "showId" INTEGER NOT NULL,

    CONSTRAINT "ShowSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowEpisode" (
    "id" SERIAL NOT NULL,
    "airDate" DATE NOT NULL,
    "number" INTEGER NOT NULL,
    "overview" TEXT NOT NULL,
    "rating" DECIMAL(3,1) NOT NULL,
    "runtime" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "tmdbStillPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "ShowEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Show_imdbId_key" ON "Show"("imdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Show_tmdbId_key" ON "Show"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowSeason_showId_number_key" ON "ShowSeason"("showId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "ShowEpisode_seasonId_number_key" ON "ShowEpisode"("seasonId", "number");

-- AddForeignKey
ALTER TABLE "ShowSeason" ADD CONSTRAINT "ShowSeason_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowEpisode" ADD CONSTRAINT "ShowEpisode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "ShowSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
