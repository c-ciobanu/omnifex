import { db } from 'src/lib/db'

import { DeleteTemporaryUserJob } from './DeleteTemporaryUserJob'
import { StandardScenario } from './DeleteTemporaryUserJob.scenarios'

describe('DeleteTemporaryUserJob', () => {
  scenario('should not throw any errors', async (scenario: StandardScenario) => {
    await expect(DeleteTemporaryUserJob.perform(scenario.user.john.id)).resolves.not.toThrow()

    const result = await db.user.findUnique({ where: { id: scenario.user.john.id } })

    expect(result).toEqual(null)
  })
})
