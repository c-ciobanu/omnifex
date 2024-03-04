export const schema = gql`
  type BasicMovie {
    id: Int!
    overview: String!
    posterUrl: String!
    releaseYear: Int!
    title: String!
  }

  type DetailedMovie {
    genres: [String!]!
    overview: String!
    posterUrl: String!
    rating: Float!
    releaseDate: Date!
    runtime: Int!
    tagline: String!
    title: String!
    tmdbId: Int!
    user: UserMovie
  }

  type UserMovie {
    favorited: Boolean!
    watched: Boolean!
    watchlisted: Boolean!
  }

  type Query {
    movie(tmdbId: Int!): DetailedMovie @skipAuth
    movies(title: String!): [BasicMovie!]! @skipAuth
  }
`
