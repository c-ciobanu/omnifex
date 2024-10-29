export const schema = gql`
  type MovieList {
    id: Int!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
  }

  type MovieListItem {
    id: Int!
    createdAt: DateTime!
    listId: Int!
    movieId: Int!
  }

  enum DefaultMovieList {
    Watchlist
    Watched
  }

  type Query {
    movieLists: [MovieList!]! @requireAuth
    movieListItems(listId: Int!): [Movie!]! @requireAuth
  }

  input CreateMovieListInput {
    name: String!
  }

  input UpdateMovieListInput {
    name: String
  }

  input CreateMovieListItemInput {
    listName: DefaultMovieList!
    movieId: Int!
  }

  type Mutation {
    createMovieList(input: CreateMovieListInput!): MovieList! @requireAuth
    updateMovieList(id: Int!, input: UpdateMovieListInput!): MovieList! @requireAuth
    deleteMovieList(id: Int!): MovieList! @requireAuth
    createMovieListItem(input: CreateMovieListItemInput!): MovieListItem! @requireAuth
    deleteMovieListItem(listName: DefaultMovieList!, movieId: Int!): MovieListItem! @requireAuth
  }
`
