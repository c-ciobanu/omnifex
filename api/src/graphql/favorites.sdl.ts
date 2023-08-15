export const schema = gql`
  type Favorite {
    id: Int!
    tmdbId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  input CreateFavoriteInput {
    tmdbId: Int!
  }

  type Mutation {
    createFavorite(input: CreateFavoriteInput!): Favorite! @requireAuth
    deleteFavorite(tmdbId: Int!): Favorite! @requireAuth
  }
`
