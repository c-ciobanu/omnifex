export const schema = gql`
  type Document {
    id: String!
    title: String!
    body: String
    isPublic: Boolean!
    isEditable: Boolean
  }

  type Query {
    documents: [Document!]! @requireAuth
    document(id: String!): Document @skipAuth
  }

  input CreateDocumentInput {
    title: String!
    body: String
  }

  input UpdateDocumentInput {
    title: String
    body: String
    isPublic: Boolean
  }

  type Mutation {
    createDocument(input: CreateDocumentInput!): Document! @requireAuth
    updateDocument(id: String!, input: UpdateDocumentInput!): Document! @requireAuth
    deleteDocument(id: String!): Document! @requireAuth
  }
`
