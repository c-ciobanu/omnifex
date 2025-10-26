/*
  Warnings:

  - You are about to drop the column `workoutId` on the `WorkoutTemplateExercise` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseId` on the `WorkoutTemplateExerciseSet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutTemplateExercise" DROP CONSTRAINT "WorkoutTemplateExercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutTemplateExerciseSet" DROP CONSTRAINT "WorkoutTemplateExerciseSet_exerciseId_fkey";

-- AlterTable
ALTER TABLE "WorkoutTemplateExercise"
RENAME COLUMN "workoutId" TO "workoutTemplateId";

-- AlterTable
ALTER TABLE "WorkoutTemplateExerciseSet"
RENAME COLUMN "exerciseId" TO "workoutTemplateExerciseId";

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExercise" ADD CONSTRAINT "WorkoutTemplateExercise_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "WorkoutTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExerciseSet" ADD CONSTRAINT "WorkoutTemplateExerciseSet_workoutTemplateExerciseId_fkey" FOREIGN KEY ("workoutTemplateExerciseId") REFERENCES "WorkoutTemplateExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
