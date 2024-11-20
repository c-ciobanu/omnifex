export const schema = gql`
  type Workout {
    id: String!
    name: String!
    date: Date!
    startTime: Time!
    endTime: Time!
    durationInSeconds: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  type Query {
    workouts: [Workout!]! @requireAuth
    workout(id: String!): Workout @requireAuth
  }

  input CreateWorkoutInput {
    name: String!
    date: DateTime!
    startTime: DateTime!
    endTime: DateTime!
    durationInSeconds: Int!
  }

  input UpdateWorkoutInput {
    name: String
    date: DateTime
    startTime: DateTime
    endTime: DateTime
    durationInSeconds: Int
  }

  type Mutation {
    createWorkout(input: CreateWorkoutInput!): Workout! @requireAuth
    updateWorkout(id: String!, input: UpdateWorkoutInput!): Workout! @requireAuth
    deleteWorkout(id: String!): Workout! @requireAuth
  }
`
