import type { Prisma, User, WatchlistItemMovie, WatchedMovie } from '@prisma/client'

export const standard = defineScenario<
  Prisma.UserCreateArgs | Prisma.WatchlistItemMovieCreateArgs | Prisma.WatchedMovieCreateArgs
>({
  user: {
    one: {
      data: {
        email: 'String6393948',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  watchlistItemMovie: {
    one: (scenario) => ({
      data: {
        tmdbId: 3033408,
        userId: scenario.user.one.id,
      },
    }),
  },
  watchedMovie: {
    one: (scenario) => ({
      data: {
        tmdbId: 1457030,
        userId: scenario.user.one.id,
      },
    }),
  },
})

export type StandardScenario = {
  user: Record<string, User>
  watchlistItemMovie: Record<string, WatchlistItemMovie>
  watchedMovie: Record<string, WatchedMovie>
}
