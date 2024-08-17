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
    type: UserBookType!
  }

  input OldCreateUserBookInput {
    bookId: Int!
  }

  type Mutation {
    createUserBook(input: CreateUserBookInput!): UserBook! @requireAuth
    deleteUserBook(bookId: Int!, type: UserBookType!): UserBook! @requireAuth
    createFavoritedBook(input: OldCreateUserBookInput!): UserBook! @requireAuth
    deleteFavoritedBook(bookId: Int!): UserBook! @requireAuth
    createReadBook(input: OldCreateUserBookInput!): UserBook! @requireAuth
    deleteReadBook(bookId: Int!): UserBook! @requireAuth
    createToReadBook(input: OldCreateUserBookInput!): UserBook! @requireAuth
    deleteToReadBook(bookId: Int!): UserBook! @requireAuth
  }
`
