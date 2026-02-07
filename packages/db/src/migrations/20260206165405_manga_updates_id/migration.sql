/*
  Warnings:

  - Made the column `mangaUpdatesId` on table `manga` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "manga" ALTER COLUMN "mangaUpdatesId" SET NOT NULL;
