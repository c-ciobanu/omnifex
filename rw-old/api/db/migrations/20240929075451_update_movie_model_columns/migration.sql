/*
  Warnings:

  - Made the column `director` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `originalLanguage` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `originalTitle` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "director" SET NOT NULL,
ALTER COLUMN "originalLanguage" SET NOT NULL,
ALTER COLUMN "originalTitle" SET NOT NULL;
