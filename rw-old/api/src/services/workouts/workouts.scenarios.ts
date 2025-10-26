import type { Prisma, Workout, User, Exercise } from '@prisma/client'

export const standard = defineScenario<Prisma.WorkoutCreateArgs | Prisma.UserCreateArgs | Prisma.ExerciseCreateArgs>({
  user: {
    john: {
      data: {
        username: 'john',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  workout: {
    one: (scenario) => ({
      data: {
        name: 'String',
        date: '2024-11-19T16:05:27.869Z',
        startTime: '2024-11-19T16:05:27.869Z',
        endTime: '2024-11-19T16:05:27.869Z',
        durationInSeconds: 2966841,
        updatedAt: '2024-11-19T16:05:27.869Z',
        userId: scenario.user.john.id,
      },
    }),
    two: (scenario) => ({
      data: {
        name: 'String',
        date: '2024-11-19T16:05:27.869Z',
        startTime: '2024-11-19T16:05:27.869Z',
        endTime: '2024-11-19T16:05:27.869Z',
        durationInSeconds: 2117659,
        updatedAt: '2024-11-19T16:05:27.869Z',
        userId: scenario.user.john.id,
      },
    }),
  },
  exercise: {
    one: {
      data: {
        name: 'String',
        instructions: ['String'],
        gifPath: 'String',
      },
    },
  },
})

export type StandardScenario = {
  user: Record<'john', User>
  workout: Record<'one' | 'two', Workout>
  exercise: Record<'one', Exercise>
}
