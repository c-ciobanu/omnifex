export const schema = gql`
  type Workout {
    id: Int!
    name: String!
    date: Date!
    startTime: Time!
    endTime: Time!
    durationInSeconds: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    exercises: [WorkoutExercise!]!
  }

  type WorkoutExercise {
    id: Int!
    order: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    workoutId: Int!
    exercise: Exercise!
    exerciseId: Int!
    sets: [WorkoutExerciseSet!]!
  }

  type WorkoutExerciseSet {
    id: Int!
    weightInKg: Int!
    reps: Int!
    restInSeconds: Int!
  }

  type Query {
    workouts: [Workout!]! @requireAuth
    workout(id: Int!): Workout @requireAuth
  }

  input CreateWorkoutInput {
    name: String!
    date: Date!
    startTime: Time!
    endTime: Time!
    durationInSeconds: Int!
  }

  input UpdateWorkoutInput {
    name: String
    date: Date
    startTime: Time
    endTime: Time
    durationInSeconds: Int
  }

  type Mutation {
    createWorkout(input: CreateWorkoutInput!): Workout! @requireAuth
    updateWorkout(id: Int!, input: UpdateWorkoutInput!): Workout! @requireAuth
    deleteWorkout(id: Int!): Workout! @requireAuth
  }
`
