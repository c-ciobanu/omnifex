export const schema = gql`
  type SearchMovie {
    tmdbId: Int!
    overview: String!
    posterUrl: String!
    releaseYear: Int!
    title: String!
  }

  type Movie {
    id: Int!
    director: String
    genres: [String!]!
    imdbId: String!
    originalLanguage: String
    originalTitle: String
    overview: String!
    posterUrl: String!
    rating: Float!
    releaseDate: Date!
    runtime: Int!
    tagline: String
    title: String!
    tmdbId: Int!
    userInfo: MovieUserInfo
  }

  type MovieUserInfo {
    watched: Boolean!
    inWatchlist: Boolean!
  }

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
    movies(title: String!): [SearchMovie!]! @skipAuth
    movie(tmdbId: Int!): Movie @skipAuth
    watchedMovies: [Movie!]! @requireAuth
    moviesWatchlist: [Movie!]! @requireAuth
  }

  type Mutation {
    watchMovie(id: Int!): MovieListItem! @requireAuth
    unwatchMovie(id: Int!): MovieListItem! @requireAuth
    watchlistMovie(id: Int!): MovieListItem! @requireAuth
    unwatchlistMovie(id: Int!): MovieListItem! @requireAuth
  }
`
