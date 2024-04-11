export const schema = gql`
  type ToWatchMovie {
    id: Int!
    movieId: Int!
    createdAt: DateTime!
    userId: Int!
  }

  input MoviesWatchlistInput {
    take: Int
  }

  type Query {
    moviesWatchlist(input: MoviesWatchlistInput!): [MovieDetails!]! @requireAuth
  }

  input CreateToWatchMovieInput {
    movieId: Int!
  }

  type Mutation {
    createToWatchMovie(input: CreateToWatchMovieInput!): ToWatchMovie! @requireAuth
    deleteToWatchMovie(movieId: Int!): ToWatchMovie! @requireAuth
  }
`
