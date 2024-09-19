-- CreateTable
CREATE TABLE "MovieList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MovieList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieListItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "MovieListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BookList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookListItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "BookListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieList_userId_name_key" ON "MovieList"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "MovieListItem_listId_movieId_key" ON "MovieListItem"("listId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "BookList_userId_name_key" ON "BookList"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "BookListItem_listId_bookId_key" ON "BookListItem"("listId", "bookId");

-- AddForeignKey
ALTER TABLE "MovieList" ADD CONSTRAINT "MovieList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieListItem" ADD CONSTRAINT "MovieListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "MovieList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieListItem" ADD CONSTRAINT "MovieListItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookList" ADD CONSTRAINT "BookList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookListItem" ADD CONSTRAINT "BookListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "BookList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookListItem" ADD CONSTRAINT "BookListItem_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
