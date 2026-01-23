-- CreateTable
CREATE TABLE "Manga" (
    "id" SERIAL NOT NULL,
    "artists" TEXT[],
    "authors" TEXT[],
    "chapters" INTEGER NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "genres" TEXT[],
    "mangaDexId" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manga_mangaDexId_key" ON "Manga"("mangaDexId");
