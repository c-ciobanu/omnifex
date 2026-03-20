/*
  Warnings:

  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutExerciseSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutTemplateExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutTemplateExerciseSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Workout" DROP CONSTRAINT "Workout_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutExercise" DROP CONSTRAINT "WorkoutExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutExercise" DROP CONSTRAINT "WorkoutExercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutExerciseSet" DROP CONSTRAINT "WorkoutExerciseSet_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutTemplate" DROP CONSTRAINT "WorkoutTemplate_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutTemplateExercise" DROP CONSTRAINT "WorkoutTemplateExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutTemplateExercise" DROP CONSTRAINT "WorkoutTemplateExercise_workoutTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutTemplateExerciseSet" DROP CONSTRAINT "WorkoutTemplateExerciseSet_workoutTemplateExerciseId_fkey";

-- DropTable
DROP TABLE "public"."Exercise";

-- DropTable
DROP TABLE "public"."Workout";

-- DropTable
DROP TABLE "public"."WorkoutExercise";

-- DropTable
DROP TABLE "public"."WorkoutExerciseSet";

-- DropTable
DROP TABLE "public"."WorkoutTemplate";

-- DropTable
DROP TABLE "public"."WorkoutTemplateExercise";

-- DropTable
DROP TABLE "public"."WorkoutTemplateExerciseSet";
