export const schema = gql`
  type SearchBook {
    coverUrl: String!
    description: String!
    googleId: String!
    publicationYear: Int!
    title: String!
  }

  type Book {
    id: Int!
    authors: [String!]!
    coverUrl: String!
    description: String!
    genres: [String!]!
    googleId: String!
    pages: Int!
    publicationDate: Date!
    subtitle: String
    title: String!
    userInfo: BookUserInfo
  }

  type BookUserInfo {
    read: Boolean!
    inReadingList: Boolean!
  }

  type Query {
    books(title: String!): [SearchBook!]! @skipAuth
    book(googleId: String!): Book @skipAuth
  }
`
