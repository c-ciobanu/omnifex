export const schema = gql`
  type WatchlistedMovie {
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

  input CreateWatchlistedMovieInput {
    movieId: Int!
  }

  type Mutation {
    createWatchlistedMovie(input: CreateWatchlistedMovieInput!): WatchlistedMovie! @requireAuth
    deleteWatchlistedMovie(movieId: Int!): WatchlistedMovie! @requireAuth
  }
`
