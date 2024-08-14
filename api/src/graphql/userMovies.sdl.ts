export const schema = gql`
  type UserMovie {
    id: Int!
    movieId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  input UserMoviesInput {
    take: Int
  }

  type Query {
    favoriteMovies(input: UserMoviesInput!): [Movie!]! @requireAuth
    watchedMovies(input: UserMoviesInput!): [Movie!]! @requireAuth
    toWatchMovies(input: UserMoviesInput!): [Movie!]! @requireAuth
  }

  input CreateUserMovieInput {
    movieId: Int!
  }

  type Mutation {
    createFavoritedMovie(input: CreateUserMovieInput!): UserMovie! @requireAuth
    deleteFavoritedMovie(movieId: Int!): UserMovie! @requireAuth
    createWatchedMovie(input: CreateUserMovieInput!): UserMovie! @requireAuth
    deleteWatchedMovie(movieId: Int!): UserMovie! @requireAuth
    createToWatchMovie(input: CreateUserMovieInput!): UserMovie! @requireAuth
    deleteToWatchMovie(movieId: Int!): UserMovie! @requireAuth
  }
`
