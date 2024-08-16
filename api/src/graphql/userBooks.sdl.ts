export const schema = gql`
  type UserBook {
    id: Int!
    bookId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  enum UserBookType {
    FAVORITED
    READ
    TO_READ
  }

  type Query {
    favoritedBooks: [Book!]! @requireAuth
    readBooks: [Book!]! @requireAuth
    toReadBooks: [Book!]! @requireAuth
    userBooks(type: UserBookType!): [Book!]! @requireAuth
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
