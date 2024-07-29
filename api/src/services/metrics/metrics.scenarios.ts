import type { Prisma, Metric, User } from '@prisma/client'

export const standard = defineScenario<Prisma.MetricCreateArgs | Prisma.UserCreateArgs>({
  user: {
    john: {
      data: {
        username: 'john',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  metric: {
    one: (scenario) => ({
      data: {
        name: 'String 1',
        unit: 'String',
        userId: scenario.user.john.id,
      },
    }),
    two: (scenario) => ({
      data: {
        name: 'String 2',
        userId: scenario.user.john.id,
      },
    }),
  },
})

export type StandardScenario = {
  user: Record<'john', User>
  metric: Record<'one' | 'two', Metric>
}
