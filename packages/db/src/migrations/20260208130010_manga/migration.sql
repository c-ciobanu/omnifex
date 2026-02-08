/*
  Warnings:

  - You are about to drop the column `mangaDexId` on the `manga` table. All the data in the column will be lost.
  - Made the column `mangaBakaId` on table `manga` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."manga_mangaDexId_key";

-- AlterTable
ALTER TABLE "manga" DROP COLUMN "mangaDexId",
ALTER COLUMN "mangaBakaId" SET NOT NULL;
