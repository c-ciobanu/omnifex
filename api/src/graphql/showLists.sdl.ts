export const schema = gql`
  type ShowList {
    id: Int!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  type ShowListItem {
    id: Int!
    createdAt: DateTime!
    listId: Int!
    showId: Int!
  }

  type Query {
    showLists: [ShowList!]! @requireAuth
    showListItems(listId: Int!): [Show!]! @requireAuth
    watchedShows: [Show!]! @requireAuth
  }

  input CreateShowListInput {
    name: String!
  }

  input UpdateShowListInput {
    name: String
  }

  input CreateShowListItemInput {
    listName: String!
    showId: Int!
  }

  type Mutation {
    createShowList(input: CreateShowListInput!): ShowList! @requireAuth
    updateShowList(id: Int!, input: UpdateShowListInput!): ShowList! @requireAuth
    deleteShowList(id: Int!): ShowList! @requireAuth
    createShowListItem(input: CreateShowListItemInput!): ShowListItem! @requireAuth
    deleteShowListItem(listName: String!, showId: Int!): ShowListItem! @requireAuth
  }
`
