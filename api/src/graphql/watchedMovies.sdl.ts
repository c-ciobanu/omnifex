export const schema = gql`
  type WatchedMovie {
    id: Int!
    movieId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  input CreateWatchedMovieInput {
    movieId: Int!
  }

  type Mutation {
    createWatchedMovie(input: CreateWatchedMovieInput!): WatchedMovie! @requireAuth
    deleteWatchedMovie(movieId: Int!): WatchedMovie! @requireAuth
  }
`
