export const schema = gql`
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

  type Mutation {
    watchShow(id: Int!): [WatchedEpisode!]! @requireAuth
    watchSeason(id: Int!): [WatchedEpisode!]! @requireAuth
    watchEpisode(id: Int!): WatchedEpisode! @requireAuth
    unwatchShow(id: Int!): BatchPayload! @requireAuth
    unwatchSeason(id: Int!): BatchPayload! @requireAuth
    unwatchEpisode(id: Int!): WatchedEpisode! @requireAuth
  }
`
