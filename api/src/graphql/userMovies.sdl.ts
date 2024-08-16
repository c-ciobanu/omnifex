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
    type: UserMovieType!
  }

  input OldCreateUserMovieInput {
    movieId: Int!
  }

  type Mutation {
    createUserMovie(input: CreateUserMovieInput!): UserMovie! @requireAuth
    deleteUserMovie(movieId: Int!, type: UserMovieType!): UserMovie! @requireAuth
    createFavoritedMovie(input: OldCreateUserMovieInput!): UserMovie! @requireAuth
    deleteFavoritedMovie(movieId: Int!): UserMovie! @requireAuth
    createWatchedMovie(input: OldCreateUserMovieInput!): UserMovie! @requireAuth
    deleteWatchedMovie(movieId: Int!): UserMovie! @requireAuth
    createToWatchMovie(input: OldCreateUserMovieInput!): UserMovie! @requireAuth
    deleteToWatchMovie(movieId: Int!): UserMovie! @requireAuth
  }
`
