export const schema = gql`
  type SearchShow {
    tmdbId: Int!
    overview: String!
    posterUrl: String!
    releaseYear: Int!
    title: String!
  }

  type Show {
    id: Int!
    backdropUrl: String!
    creators: [String!]!
    genres: [String!]!
    imdbId: String!
    originalLanguage: String!
    originalTitle: String!
    overview: String!
    posterUrl: String!
    rating: Float!
    tagline: String
    title: String!
    tmdbId: Int!
    seasons: [Season!]!
  }

  type Season {
    id: Int!
    airDate: DateTime!
    number: Int!
    overview: String!
    posterUrl: String!
    rating: Float!
  }

  type Query {
    shows(title: String!): [SearchShow!]! @skipAuth
    show(tmdbId: Int!): Show @skipAuth
  }
`
