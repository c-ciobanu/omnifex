export const schema = gql`
  type Query {
    documentsUrl: String! @requireAuth
  }

  type Mutation {
    createDocumentsUploadUrl: String! @requireAuth
  }
`
