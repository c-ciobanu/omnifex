import { metrics, metric, createMetric, updateMetric, deleteMetric } from './metrics'
import type { StandardScenario } from './metrics.scenarios'

describe('metrics', () => {
  scenario('returns all metrics', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await metrics()

    expect(result.length).toEqual(Object.keys(scenario.metric).length)
  })

  scenario('returns a single metric', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await metric({ id: scenario.metric.one.id })

    expect(result).toEqual(scenario.metric.one)
  })

  scenario('creates a metric', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await createMetric({ input: { name: 'String' } })

    expect(result.name).toEqual('String')
  })

  scenario('updates a metric', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await metric({ id: scenario.metric.one.id })
    const result = await updateMetric({ id: original.id, input: { name: 'String2' } })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a metric', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteMetric({ id: scenario.metric.one.id })
    const result = await metric({ id: original.id })

    expect(result).toEqual(null)
  })
})
