import type { Prisma, WatchlistItemMovie } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.WatchlistItemMovieCreateArgs>({
  watchlistItemMovie: {
    one: {
      data: {
        tmdbId: 3033408,
        user: {
          create: {
            email: 'String9814925',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        tmdbId: 7706799,
        user: {
          create: {
            email: 'String8093241',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<WatchlistItemMovie, 'watchlistItemMovie'>
