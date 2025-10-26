-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoritedBook" DROP CONSTRAINT "FavoritedBook_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoritedMovie" DROP CONSTRAINT "FavoritedMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "Metric" DROP CONSTRAINT "Metric_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadBook" DROP CONSTRAINT "ReadBook_userId_fkey";

-- DropForeignKey
ALTER TABLE "ToReadBook" DROP CONSTRAINT "ToReadBook_userId_fkey";

-- DropForeignKey
ALTER TABLE "ToWatchMovie" DROP CONSTRAINT "ToWatchMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "WatchedMovie" DROP CONSTRAINT "WatchedMovie_userId_fkey";

-- AddForeignKey
ALTER TABLE "FavoritedMovie" ADD CONSTRAINT "FavoritedMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToWatchMovie" ADD CONSTRAINT "ToWatchMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritedBook" ADD CONSTRAINT "FavoritedBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadBook" ADD CONSTRAINT "ReadBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToReadBook" ADD CONSTRAINT "ToReadBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
