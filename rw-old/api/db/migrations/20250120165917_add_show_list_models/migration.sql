-- CreateTable
CREATE TABLE "ShowList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ShowList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowListItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,

    CONSTRAINT "ShowListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowList_userId_name_key" ON "ShowList"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ShowListItem_listId_showId_key" ON "ShowListItem"("listId", "showId");

-- AddForeignKey
ALTER TABLE "ShowList" ADD CONSTRAINT "ShowList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowListItem" ADD CONSTRAINT "ShowListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ShowList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowListItem" ADD CONSTRAINT "ShowListItem_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
