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
    seasons: [Season!]
  }

  type Season {
    id: Int!
    airDate: Date!
    number: Int!
    overview: String!
    posterUrl: String!
    rating: Float!
    episodes: [Episode!]
  }

  type Episode {
    id: Int!
    airDate: Date!
    number: Int!
    overview: String!
    rating: Float!
    runtime: Int!
    stillUrl: String!
    title: String!
  }

  type Query {
    shows(title: String!): [SearchShow!]! @skipAuth
    show(tmdbId: Int!): Show @skipAuth
    season(showTmdbId: Int!, seasonNumber: Int!): Season @skipAuth
  }
`
