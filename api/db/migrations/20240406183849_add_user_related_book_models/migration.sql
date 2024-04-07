-- CreateTable
CREATE TABLE "FavoritedBook" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FavoritedBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadBook" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ReadBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToReadBook" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ToReadBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoritedBook_bookId_userId_key" ON "FavoritedBook"("bookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadBook_bookId_userId_key" ON "ReadBook"("bookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ToReadBook_bookId_userId_key" ON "ToReadBook"("bookId", "userId");

-- AddForeignKey
ALTER TABLE "FavoritedBook" ADD CONSTRAINT "FavoritedBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritedBook" ADD CONSTRAINT "FavoritedBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadBook" ADD CONSTRAINT "ReadBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadBook" ADD CONSTRAINT "ReadBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToReadBook" ADD CONSTRAINT "ToReadBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToReadBook" ADD CONSTRAINT "ToReadBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
