export const schema = gql`
  type WatchlistItemMovie {
    id: Int!
    movieId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  input MoviesWatchlistInput {
    take: Int
  }

  type Query {
    moviesWatchlist(input: MoviesWatchlistInput!): [MovieDetails!]! @requireAuth
  }

  input CreateWatchlistItemMovieInput {
    movieId: Int!
  }

  type Mutation {
    createWatchlistItemMovie(input: CreateWatchlistItemMovieInput!): WatchlistItemMovie! @requireAuth
    deleteWatchlistItemMovie(movieId: Int!): WatchlistItemMovie! @requireAuth
  }
`
