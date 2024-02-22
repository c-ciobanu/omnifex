export const schema = gql`
  type WatchedMovie {
    id: Int!
    tmdbId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  input CreateWatchedMovieInput {
    tmdbId: Int!
  }

  type Mutation {
    createWatchedMovie(input: CreateWatchedMovieInput!): WatchedMovie! @requireAuth
    deleteWatchedMovie(tmdbId: Int!): WatchedMovie! @requireAuth
  }
`
