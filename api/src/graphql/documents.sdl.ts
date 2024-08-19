export const schema = gql`
  type Document {
    id: String!
    title: String!
    body: String
  }

  type Query {
    documentsUrl: String! @requireAuth
    documents: [Document!]! @requireAuth
    document(id: String!): Document @requireAuth
  }

  input CreateDocumentInput {
    title: String!
    body: String
  }

  input UpdateDocumentInput {
    title: String
    body: String
  }

  type Mutation {
    createDocumentsUploadUrl: String! @requireAuth
    createDocument(input: CreateDocumentInput!): Document! @requireAuth
    updateDocument(id: String!, input: UpdateDocumentInput!): Document! @requireAuth
    deleteDocument(id: String!): Document! @requireAuth
  }
`
