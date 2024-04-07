export const schema = gql`
  type UserBook {
    id: Int!
    bookId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  input UserBooksInput {
    take: Int
  }

  type Query {
    favoritedBooks(input: UserBooksInput!): [Book!]! @requireAuth
    readBooks(input: UserBooksInput!): [Book!]! @requireAuth
    toReadBooks(input: UserBooksInput!): [Book!]! @requireAuth
  }

  input CreateUserBookInput {
    bookId: Int!
  }

  type Mutation {
    createFavoritedBook(input: CreateUserBookInput!): UserBook! @requireAuth
    deleteFavoritedBook(bookId: Int!): UserBook! @requireAuth
    createReadBook(input: CreateUserBookInput!): UserBook! @requireAuth
    deleteReadBook(bookId: Int!): UserBook! @requireAuth
    createToReadBook(input: CreateUserBookInput!): UserBook! @requireAuth
    deleteToReadBook(bookId: Int!): UserBook! @requireAuth
  }
`
