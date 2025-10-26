-- CreateTable
CREATE TABLE "WatchlistedMovie" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WatchlistedMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistedMovie_movieId_userId_key" ON "WatchlistedMovie"("movieId", "userId");

-- AddForeignKey
ALTER TABLE "WatchlistedMovie" ADD CONSTRAINT "WatchlistedMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistedMovie" ADD CONSTRAINT "WatchlistedMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
