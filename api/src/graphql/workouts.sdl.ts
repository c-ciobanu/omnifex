export const schema = gql`
  type WorkoutTemplate {
    id: Int!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    exercises: [WorkoutTemplateExercise!]!
  }

  type WorkoutTemplateExercise {
    id: Int!
    order: Int!
    workoutTemplateId: Int!
    exercise: Exercise!
    exerciseId: Int!
    sets: [WorkoutTemplateExerciseSet!]!
  }

  type WorkoutTemplateExerciseSet {
    id: Int!
    weightInKg: Int!
    reps: Int!
    restInSeconds: Int!
  }

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
    workoutTemplates: [WorkoutTemplate!]! @requireAuth
    workoutTemplate(id: Int!): WorkoutTemplate @requireAuth
  }

  input CreateWorkoutExerciseSetInput {
    weightInKg: Int!
    reps: Int!
    restInSeconds: Int!
  }

  input CreateWorkoutExerciseInput {
    exerciseId: Int!
    order: Int!
    sets: [CreateWorkoutExerciseSetInput!]!
  }

  input CreateWorkoutTemplateInput {
    name: String!
    exercises: [CreateWorkoutExerciseInput]
  }

  input UpdateWorkoutTemplateInput {
    name: String
  }

  input CreateWorkoutInput {
    name: String!
    date: Date!
    startTime: Time!
    endTime: Time!
    durationInSeconds: Int!
    exercises: [CreateWorkoutExerciseInput]
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
    createWorkoutTemplate(input: CreateWorkoutTemplateInput!): WorkoutTemplate! @requireAuth
    updateWorkoutTemplate(id: Int!, input: UpdateWorkoutTemplateInput!): WorkoutTemplate! @requireAuth
    deleteWorkoutTemplate(id: Int!): WorkoutTemplate! @requireAuth
  }
`
