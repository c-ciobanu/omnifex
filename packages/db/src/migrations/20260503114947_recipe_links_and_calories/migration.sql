-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "calories" INTEGER;

-- CreateTable
CREATE TABLE "recipe-link" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "text" TEXT,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "recipe-link_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe-link" ADD CONSTRAINT "recipe-link_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
