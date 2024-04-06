export const schema = gql`
  type Book {
    id: Int
    authors: [String!]!
    coverUrl: String
    description: String
    genres: [String!]
    googleId: String!
    pages: Int
    publicationDate: Date
    subtitle: String
    title: String!
  }

  type Query {
    book(googleId: String!): Book @skipAuth
    books(title: String!): [Book!]! @skipAuth
  }
`
