export const schema = gql`
  type Favorited {
    id: Int!
    tmdbId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  input CreateFavoritedInput {
    tmdbId: Int!
  }

  type Mutation {
    createFavorited(input: CreateFavoritedInput!): Favorited! @requireAuth
    deleteFavorited(tmdbId: Int!): Favorited! @requireAuth
  }
`
