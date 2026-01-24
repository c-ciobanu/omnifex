/*
  Warnings:

  - You are about to drop the `Manga` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Manga";

-- CreateTable
CREATE TABLE "manga" (
    "aniListId" TEXT,
    "artists" TEXT[],
    "authors" TEXT[],
    "chapters" INTEGER NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "genres" TEXT[],
    "id" SERIAL NOT NULL,
    "mangaDexId" TEXT NOT NULL,
    "mangaUpdatesId" TEXT,
    "releaseYear" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manga-to-read" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "mangaId" INTEGER NOT NULL,

    CONSTRAINT "manga-to-read_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manga-abandoned" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "mangaId" INTEGER NOT NULL,

    CONSTRAINT "manga-abandoned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manga-progress" (
    "id" SERIAL NOT NULL,
    "lastChapterRead" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "mangaId" INTEGER NOT NULL,

    CONSTRAINT "manga-progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manga_mangaDexId_key" ON "manga"("mangaDexId");

-- CreateIndex
CREATE UNIQUE INDEX "manga-to-read_userId_mangaId_key" ON "manga-to-read"("userId", "mangaId");

-- CreateIndex
CREATE UNIQUE INDEX "manga-abandoned_userId_mangaId_key" ON "manga-abandoned"("userId", "mangaId");

-- CreateIndex
CREATE UNIQUE INDEX "manga-progress_userId_mangaId_key" ON "manga-progress"("userId", "mangaId");

-- AddForeignKey
ALTER TABLE "manga-to-read" ADD CONSTRAINT "manga-to-read_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga-to-read" ADD CONSTRAINT "manga-to-read_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga-abandoned" ADD CONSTRAINT "manga-abandoned_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga-abandoned" ADD CONSTRAINT "manga-abandoned_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga-progress" ADD CONSTRAINT "manga-progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga-progress" ADD CONSTRAINT "manga-progress_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
