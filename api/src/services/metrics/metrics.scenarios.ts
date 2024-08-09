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
        entries: {
          create: [
            { value: '100', date: new Date('2020-01-01') },
            { value: '90', date: new Date('2021-01-01') },
            { value: '80', date: new Date('2022-01-01') },
          ],
        },
      },
    }),
    two: (scenario) => ({
      data: {
        name: 'String 2',
        userId: scenario.user.john.id,
        entries: {
          create: [
            { value: '110', date: new Date('2024-01-01') },
            { value: '100', date: new Date('2024-02-01') },
            { value: '90', date: new Date('2024-03-01') },
          ],
        },
      },
      include: {
        entries: true,
      },
    }),
  },
})

export type StandardScenario = {
  user: Record<'john', User>
  metric: Record<'one' | 'two', Metric & Prisma.MetricInclude>
}
