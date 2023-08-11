export const schema = gql`
  type Movie {
    id: Int!
    title: String!
    posterUrl: String!
  }

  type Query {
    movies(title: String!): [Movie!]! @skipAuth
  }
`
