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
    userBooks(type: UserBookType!): [Book!]! @requireAuth
  }

  input CreateUserBookInput {
    bookId: Int!
    type: UserBookType!
  }

  type Mutation {
    createUserBook(input: CreateUserBookInput!): UserBook! @requireAuth
    deleteUserBook(bookId: Int!, type: UserBookType!): UserBook! @requireAuth
  }
`
