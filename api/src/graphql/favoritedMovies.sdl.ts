export const schema = gql`
  type FavoritedMovie {
    id: Int!
    movieId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  input CreateFavoritedMovieInput {
    movieId: Int!
  }

  type Mutation {
    createFavoritedMovie(input: CreateFavoritedMovieInput!): FavoritedMovie! @requireAuth
    deleteFavoritedMovie(movieId: Int!): FavoritedMovie! @requireAuth
  }
`
