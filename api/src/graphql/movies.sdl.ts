export const schema = gql`
  type Movie {
    id: Int!
    posterUrl: String!
    releaseYear: Int!
    title: String!
  }

  type Query {
    movies(title: String!): [Movie!]! @skipAuth
  }
`
