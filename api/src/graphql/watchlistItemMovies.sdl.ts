export const schema = gql`
  type WatchlistItemMovie {
    id: Int!
    tmdbId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  input CreateWatchlistItemMovieInput {
    tmdbId: Int!
  }

  type Mutation {
    createWatchlistItemMovie(input: CreateWatchlistItemMovieInput!): WatchlistItemMovie! @requireAuth
    deleteWatchlistItemMovie(tmdbId: Int!): WatchlistItemMovie! @requireAuth
  }
`
