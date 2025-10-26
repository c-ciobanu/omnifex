-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "authors" TEXT[],
    "description" TEXT NOT NULL,
    "genres" TEXT[],
    "googleId" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "publicationDate" DATE NOT NULL,
    "subtitle" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_googleId_key" ON "Book"("googleId");
