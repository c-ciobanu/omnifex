-- DropForeignKey
ALTER TABLE "WorkoutTemplateExercise" DROP CONSTRAINT "WorkoutTemplateExercise_workoutTemplateId_fkey";

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExercise" ADD CONSTRAINT "WorkoutTemplateExercise_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "WorkoutTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
