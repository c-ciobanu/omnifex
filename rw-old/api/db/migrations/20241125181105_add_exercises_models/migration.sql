-- CreateTable
CREATE TABLE "WorkoutExercise" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExerciseSet" (
    "id" SERIAL NOT NULL,
    "weightInKg" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "restInSeconds" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutExerciseSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "instructions" TEXT[],
    "gifPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseSet" ADD CONSTRAINT "WorkoutExerciseSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "WorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
