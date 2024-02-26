import type { Prisma, WatchedMovie, User, WatchlistItemMovie } from '@prisma/client'

export const standard = defineScenario<
  Prisma.UserCreateArgs | Prisma.WatchedMovieCreateArgs | Prisma.WatchlistItemMovieCreateArgs
>({
  user: {
    one: {
      data: {
        email: 'String4672043',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  watchedMovie: {
    one: (scenario) => ({
      data: {
        tmdbId: 1425510,
        userId: scenario.user.one.id,
      },
    }),
  },
  watchlistItemMovie: {
    one: (scenario) => ({
      data: {
        tmdbId: 2562972,
        userId: scenario.user.one.id,
      },
    }),
  },
})

export type StandardScenario = {
  user: Record<string, User>
  watchedMovie: Record<string, WatchedMovie>
  watchlistItemMovie: Record<string, WatchlistItemMovie>
}
