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

  type BookList {
    id: Int!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  type BookListItem {
    id: Int!
    createdAt: DateTime!
    listId: Int!
    bookId: Int!
  }

  type Query {
    books(title: String!): [SearchBook!]! @skipAuth
    book(googleId: String!): Book @skipAuth
    readBooks: [Book!]! @requireAuth
    booksReadingList: [Book!]! @requireAuth
  }

  type Mutation {
    readBook(id: Int!): BookListItem! @requireAuth
    unreadBook(id: Int!): BookListItem! @requireAuth
    readingListBook(id: Int!): BookListItem! @requireAuth
    unreadingListBook(id: Int!): BookListItem! @requireAuth
  }
`
