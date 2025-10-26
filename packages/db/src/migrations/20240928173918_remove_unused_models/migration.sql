/*
  Warnings:

  - You are about to drop the `FavoritedBook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoritedMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadBook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ToReadBook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ToWatchMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WatchedMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavoritedBook" DROP CONSTRAINT "FavoritedBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "FavoritedBook" DROP CONSTRAINT "FavoritedBook_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoritedMovie" DROP CONSTRAINT "FavoritedMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "FavoritedMovie" DROP CONSTRAINT "FavoritedMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadBook" DROP CONSTRAINT "ReadBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "ReadBook" DROP CONSTRAINT "ReadBook_userId_fkey";

-- DropForeignKey
ALTER TABLE "ToReadBook" DROP CONSTRAINT "ToReadBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "ToReadBook" DROP CONSTRAINT "ToReadBook_userId_fkey";

-- DropForeignKey
ALTER TABLE "ToWatchMovie" DROP CONSTRAINT "ToWatchMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "ToWatchMovie" DROP CONSTRAINT "ToWatchMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "WatchedMovie" DROP CONSTRAINT "WatchedMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "WatchedMovie" DROP CONSTRAINT "WatchedMovie_userId_fkey";

-- DropTable
DROP TABLE "FavoritedBook";

-- DropTable
DROP TABLE "FavoritedMovie";

-- DropTable
DROP TABLE "ReadBook";

-- DropTable
DROP TABLE "ToReadBook";

-- DropTable
DROP TABLE "ToWatchMovie";

-- DropTable
DROP TABLE "WatchedMovie";
