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
    favoriteMovies: [Movie!]! @requireAuth
    watchedMovies: [Movie!]! @requireAuth
    toWatchMovies: [Movie!]! @requireAuth
    userMovies(type: UserMovieType!): [Movie!]! @requireAuth
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
