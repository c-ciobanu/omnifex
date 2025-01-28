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
    userProgress: ShowProgress
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

  type ShowProgress {
    watched: Boolean!
    inWatchlist: Boolean!
    abandoned: Boolean!
  }

  type WatchlistShow {
    id: Int!
    createdAt: DateTime!
    userId: Int!
    showId: Int!
  }

  type AbandonedShow {
    id: Int!
    createdAt: DateTime!
    userId: Int!
    showId: Int!
  }

  type WatchedEpisode {
    id: Int!
    userId: Int!
    showId: Int!
    seasonId: Int!
    episodeId: Int!
  }

  type BatchPayload {
    count: Int!
  }

  type Query {
    shows(title: String!): [SearchShow!]! @skipAuth
    show(tmdbId: Int!): Show @skipAuth
    season(showTmdbId: Int!, seasonNumber: Int!): Season @skipAuth
    watchedShows: [Show!]! @requireAuth
    showsWatchlist: [Show!]! @requireAuth
    abandonedShows: [Show!]! @requireAuth
  }

  type Mutation {
    watchShow(id: Int!): [WatchedEpisode!]! @requireAuth
    unwatchShow(id: Int!): BatchPayload! @requireAuth
    watchSeason(id: Int!): [WatchedEpisode!]! @requireAuth
    unwatchSeason(id: Int!): BatchPayload! @requireAuth
    watchEpisode(id: Int!): WatchedEpisode! @requireAuth
    unwatchEpisode(id: Int!): WatchedEpisode! @requireAuth
    watchlistShow(showId: Int!): WatchlistShow! @requireAuth
    unwatchlistShow(showId: Int!): WatchlistShow! @requireAuth
    abandonShow(showId: Int!): AbandonedShow! @requireAuth
    unabandonShow(showId: Int!): AbandonedShow! @requireAuth
  }
`
