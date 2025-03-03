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

  type Query {
    movieLists: [MovieList!]! @requireAuth
    movieListItems(listId: Int!): [Movie!]! @requireAuth
    moviesWatchlist: [Movie!]! @requireAuth
    watchedMovies: [Movie!]! @requireAuth
  }

  input CreateMovieListInput {
    name: String!
  }

  input UpdateMovieListInput {
    name: String
  }

  input CreateMovieListItemInput {
    listName: String!
    movieId: Int!
  }

  type Mutation {
    createMovieList(input: CreateMovieListInput!): MovieList! @requireAuth
    updateMovieList(id: Int!, input: UpdateMovieListInput!): MovieList! @requireAuth
    deleteMovieList(id: Int!): MovieList! @requireAuth
    createMovieListItem(input: CreateMovieListItemInput!): MovieListItem! @requireAuth
    deleteMovieListItem(listName: String!, movieId: Int!): MovieListItem! @requireAuth
    watchlistMovie(id: Int!): MovieListItem! @requireAuth
    unwatchlistMovie(id: Int!): MovieListItem! @requireAuth
    watchMovie(id: Int!): MovieListItem! @requireAuth
    unwatchMovie(id: Int!): MovieListItem! @requireAuth
  }
`
