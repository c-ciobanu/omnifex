import { createWorkout, deleteWorkout, updateWorkout, workout, workouts } from './workouts'
import type { StandardScenario } from './workouts.scenarios'

describe('workouts', () => {
  scenario('returns all workouts', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await workouts()

    expect(result.length).toEqual(Object.keys(scenario.workout).length)
  })

  scenario('returns a single workout', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await workout({ id: scenario.workout.one.id })

    expect(result).toEqual(scenario.workout.one)
  })

  scenario.only('creates a workout', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await createWorkout({
      input: {
        name: 'String',
        date: new Date('2024-11-19'),
        startTime: new Date('1970-01-01T14:05:00Z'),
        endTime: new Date('1970-01-01T16:05:00Z'),
        durationInSeconds: 8112488,
        exercises: [
          { exerciseId: scenario.exercise.one.id, order: 1, sets: [{ weightInKg: 50, reps: 12, restInSeconds: 60 }] },
        ],
      },
    })

    expect(result.name).toEqual('String')
    expect(result.date).toEqual(new Date('2024-11-19'))
    expect(result.startTime).toEqual(new Date('1970-01-01T14:05:00Z'))
    expect(result.endTime).toEqual(new Date('1970-01-01T16:05:00Z'))
    expect(result.durationInSeconds).toEqual(8112488)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  scenario('updates a workout', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await workout({ id: scenario.workout.one.id })
    const result = await updateWorkout({ id: original.id, input: { name: 'String2' } })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a workout', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteWorkout({ id: scenario.workout.one.id })
    const result = await workout({ id: original.id })

    expect(result).toEqual(null)
  })
})
