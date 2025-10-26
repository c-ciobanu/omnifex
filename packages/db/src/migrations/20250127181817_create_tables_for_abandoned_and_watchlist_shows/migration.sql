-- CreateTable
CREATE TABLE "WatchlistShow" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,

    CONSTRAINT "WatchlistShow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbandonedShow" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,

    CONSTRAINT "AbandonedShow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistShow_userId_showId_key" ON "WatchlistShow"("userId", "showId");

-- CreateIndex
CREATE UNIQUE INDEX "AbandonedShow_userId_showId_key" ON "AbandonedShow"("userId", "showId");

-- AddForeignKey
ALTER TABLE "WatchlistShow" ADD CONSTRAINT "WatchlistShow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistShow" ADD CONSTRAINT "WatchlistShow_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbandonedShow" ADD CONSTRAINT "AbandonedShow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbandonedShow" ADD CONSTRAINT "AbandonedShow_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
