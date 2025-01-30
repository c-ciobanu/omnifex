/*
  Warnings:

  - You are about to drop the `ShowList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowListItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShowList" DROP CONSTRAINT "ShowList_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShowListItem" DROP CONSTRAINT "ShowListItem_listId_fkey";

-- DropForeignKey
ALTER TABLE "ShowListItem" DROP CONSTRAINT "ShowListItem_showId_fkey";

-- DropTable
DROP TABLE "ShowList";

-- DropTable
DROP TABLE "ShowListItem";
