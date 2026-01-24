/*
  Warnings:

  - You are about to drop the `manga-abandoned` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manga-to-read` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `manga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `manga-progress` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MangaStatus" AS ENUM ('ENDED', 'ONGOING', 'CANCELLED', 'ON_HIATUS');

-- CreateEnum
CREATE TYPE "MangaProgressStatus" AS ENUM ('ABANDONED', 'READ', 'READING', 'TO_READ');

-- DropForeignKey
ALTER TABLE "public"."manga-abandoned" DROP CONSTRAINT "manga-abandoned_mangaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."manga-abandoned" DROP CONSTRAINT "manga-abandoned_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."manga-to-read" DROP CONSTRAINT "manga-to-read_mangaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."manga-to-read" DROP CONSTRAINT "manga-to-read_userId_fkey";

-- AlterTable
ALTER TABLE "manga" ADD COLUMN     "status" "MangaStatus" NOT NULL;

-- AlterTable
ALTER TABLE "manga-progress" ADD COLUMN     "status" "MangaProgressStatus" NOT NULL,
ALTER COLUMN "lastChapterRead" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."manga-abandoned";

-- DropTable
DROP TABLE "public"."manga-to-read";
