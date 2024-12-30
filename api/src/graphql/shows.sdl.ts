export const schema = gql`
  type SearchShow {
    tmdbId: Int!
    overview: String!
    posterUrl: String!
    releaseYear: Int!
    title: String!
  }

  type Query {
    shows(title: String!): [SearchShow!]! @skipAuth
  }
`
