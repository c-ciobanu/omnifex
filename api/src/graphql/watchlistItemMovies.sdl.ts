export const schema = gql`
  type WatchlistItemMovie {
    id: Int!
    movieId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  input CreateWatchlistItemMovieInput {
    movieId: Int!
  }

  type Mutation {
    createWatchlistItemMovie(input: CreateWatchlistItemMovieInput!): WatchlistItemMovie! @requireAuth
    deleteWatchlistItemMovie(movieId: Int!): WatchlistItemMovie! @requireAuth
  }
`
