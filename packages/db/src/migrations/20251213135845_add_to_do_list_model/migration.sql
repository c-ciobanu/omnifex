-- CreateTable
CREATE TABLE "to-do-list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "featuredOnDashboard" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "to-do-list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "to-do-list-item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "to-do-list-item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "to-do-list" ADD CONSTRAINT "to-do-list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "to-do-list-item" ADD CONSTRAINT "to-do-list-item_listId_fkey" FOREIGN KEY ("listId") REFERENCES "to-do-list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
