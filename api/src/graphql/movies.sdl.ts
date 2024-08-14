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
    genres: [String!]!
    imdbId: String!
    overview: String!
    posterUrl: String!
    rating: Float!
    releaseDate: Date!
    runtime: Int!
    tagline: String!
    title: String!
    tmdbId: Int!
    userInfo: MovieUserInfo
  }

  type MovieUserInfo {
    favorited: Boolean!
    watched: Boolean!
    inWatchlist: Boolean!
  }

  type Query {
    movies(title: String!): [SearchMovie!]! @skipAuth
    movie(tmdbId: Int!): Movie @skipAuth
  }
`
