import type { Prisma, Favorited } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.FavoritedCreateArgs>({
  favorited: {
    one: {
      data: {
        tmdbId: 1425510,
        user: {
          create: {
            email: 'String1830174',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        tmdbId: 2562972,
        user: {
          create: {
            email: 'String2297818',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Favorited, 'favorited'>
