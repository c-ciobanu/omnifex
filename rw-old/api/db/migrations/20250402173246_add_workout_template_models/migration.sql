-- CreateTable
CREATE TABLE "WorkoutTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutTemplateExercise" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "workoutId" INTEGER,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutTemplateExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutTemplateExerciseSet" (
    "id" SERIAL NOT NULL,
    "weightInKg" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "restInSeconds" INTEGER NOT NULL,
    "exerciseId" INTEGER,

    CONSTRAINT "WorkoutTemplateExerciseSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutTemplate" ADD CONSTRAINT "WorkoutTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExercise" ADD CONSTRAINT "WorkoutTemplateExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "WorkoutTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExercise" ADD CONSTRAINT "WorkoutTemplateExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutTemplateExerciseSet" ADD CONSTRAINT "WorkoutTemplateExerciseSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "WorkoutTemplateExercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
