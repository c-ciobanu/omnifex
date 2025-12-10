-- CreateTable
CREATE TABLE "shopping-list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "shopping-list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping-list-item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bought" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "shopping-list-item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shopping-list" ADD CONSTRAINT "shopping-list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping-list-item" ADD CONSTRAINT "shopping-list-item_listId_fkey" FOREIGN KEY ("listId") REFERENCES "shopping-list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
