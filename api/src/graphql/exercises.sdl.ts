export const schema = gql`
  type Exercise {
    id: Int!
    name: String!
    instructions: [String!]!
    gifUrl: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    exercises: [Exercise!]! @requireAuth
  }
`
