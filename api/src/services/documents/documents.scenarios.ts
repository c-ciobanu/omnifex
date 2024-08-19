import type { Prisma, Document, User } from '@prisma/client'

export const standard = defineScenario<Prisma.DocumentCreateArgs | Prisma.UserCreateArgs>({
  user: {
    john: {
      data: {
        username: 'john',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  document: {
    one: (scenario) => ({
      data: {
        title: 'String 1',
        body: 'String',
        userId: scenario.user.john.id,
      },
    }),
    two: (scenario) => ({
      data: {
        title: 'String 2',
        userId: scenario.user.john.id,
      },
    }),
  },
})

export type StandardScenario = {
  user: Record<'john', User>
  document: Record<'one' | 'two', Document>
}
