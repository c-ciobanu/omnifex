export const schema = gql`
  type UserMovie {
    id: Int!
    createdAt: DateTime!
    movieId: Int!
    userId: Int!
  }

  enum UserMovieType {
    FAVORITED
    WATCHED
    TO_WATCH
  }

  type Query {
    userMovies(type: UserMovieType!): [Movie!]! @requireAuth
  }

  input CreateUserMovieInput {
    movieId: Int!
    type: UserMovieType!
  }

  type Mutation {
    createUserMovie(input: CreateUserMovieInput!): UserMovie! @requireAuth
    deleteUserMovie(movieId: Int!, type: UserMovieType!): UserMovie! @requireAuth
  }
`
