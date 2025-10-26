-- CreateEnum
CREATE TYPE "BookListType" AS ENUM ('READING_LIST', 'READ', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MovieListType" AS ENUM ('WATCHLIST', 'WATCHED', 'CUSTOM');

-- AlterTable
ALTER TABLE "BookList" ADD COLUMN     "type" "BookListType" NOT NULL DEFAULT 'CUSTOM';

-- AlterTable
ALTER TABLE "MovieList" ADD COLUMN     "type" "MovieListType" NOT NULL DEFAULT 'CUSTOM';
