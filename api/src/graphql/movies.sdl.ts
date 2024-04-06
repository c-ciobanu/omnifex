export const schema = gql`
  type SearchMovie {
    tmdbId: Int!
    overview: String!
    posterUrl: String!
    releaseYear: Int!
    title: String!
  }

  type MovieDetails {
    id: Int!
    genres: [String!]!
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
    movie(tmdbId: Int!): MovieDetails @skipAuth
    movies(title: String!): [SearchMovie!]! @skipAuth
  }
`
