export const schema = gql`
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
    bookLists: [BookList!]! @requireAuth
    bookListItems(listId: Int!): [Book!]! @requireAuth
  }

  input CreateBookListInput {
    name: String!
  }

  input UpdateBookListInput {
    name: String
  }

  input CreateBookListItemInput {
    listName: String!
    bookId: Int!
  }

  type Mutation {
    createBookList(input: CreateBookListInput!): BookList! @requireAuth
    updateBookList(id: Int!, input: UpdateBookListInput!): BookList! @requireAuth
    deleteBookList(id: Int!): BookList! @requireAuth
    createBookListItem(input: CreateBookListItemInput!): BookListItem! @requireAuth
    deleteBookListItem(listName: String!, bookId: Int!): BookListItem! @requireAuth
  }
`
