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
    id: Int!
    overview: String!
    posterUrl: String!
    rating: Float!
    releaseYear: Int!
    runtime: Int!
    tagline: String!
    title: String!
    user: UserMovie
  }

  type UserMovie {
    favorited: Boolean!
    watched: Boolean!
    watchlisted: Boolean!
  }

  type Query {
    movie(id: Int!): DetailedMovie @skipAuth
    movies(title: String!): [BasicMovie!]! @skipAuth
  }
`
