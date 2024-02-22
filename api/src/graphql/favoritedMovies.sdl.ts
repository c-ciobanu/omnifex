export const schema = gql`
  type FavoritedMovie {
    id: Int!
    tmdbId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  input CreateFavoritedMovieInput {
    tmdbId: Int!
  }

  type Mutation {
    createFavoritedMovie(input: CreateFavoritedMovieInput!): FavoritedMovie! @requireAuth
    deleteFavoritedMovie(tmdbId: Int!): FavoritedMovie! @requireAuth
  }
`
