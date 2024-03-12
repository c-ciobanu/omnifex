export const schema = gql`
  type WatchedMovie {
    id: Int!
    movieId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  input WatchedMoviesInput {
    take: Int
  }

  type Query {
    watchedMovies(input: WatchedMoviesInput!): [MovieDetails!]! @requireAuth
  }

  input CreateWatchedMovieInput {
    movieId: Int!
  }

  type Mutation {
    createWatchedMovie(input: CreateWatchedMovieInput!): WatchedMovie! @requireAuth
    deleteWatchedMovie(movieId: Int!): WatchedMovie! @requireAuth
  }
`
