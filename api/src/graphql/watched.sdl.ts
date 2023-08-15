export const schema = gql`
  type Watched {
    id: Int!
    tmdbId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  input CreateWatchedInput {
    tmdbId: Int!
  }

  type Mutation {
    createWatched(input: CreateWatchedInput!): Watched! @requireAuth
    deleteWatched(tmdbId: Int!): Watched! @requireAuth
  }
`
