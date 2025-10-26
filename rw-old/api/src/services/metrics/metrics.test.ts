import { db } from 'src/lib/db'

import {
  metrics,
  metric,
  createMetric,
  updateMetric,
  deleteMetric,
  createMetricEntry,
  updateMetricEntry,
  deleteMetricEntry,
} from './metrics'
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
    const result = await createMetric({
      input: { name: 'String', unit: 'String', entry: { value: 10.0, date: new Date('2024-08-05') } },
    })

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

  scenario('creates a metricEntry', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)

    const result = await createMetricEntry({
      input: { value: 10.0, date: new Date('2024-08-05'), metricId: scenario.metric.two.id },
    })

    expect(result.value).toEqual(10.0)
    expect(result.date).toEqual(new Date('2024-08-05'))
  })

  scenario('updates a metricEntry', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)

    const result = await updateMetricEntry({ id: scenario.metric.two.entries[0].id, input: { value: 12.0 } })

    expect(result.value).toEqual(12.0)
  })

  scenario('deletes a metricEntry', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)

    await deleteMetricEntry({ id: scenario.metric.two.entries[0].id })

    await expect(db.metricEntry.count({ where: { id: scenario.metric.two.entries[0].id } })).resolves.toBe(0)
  })
})
