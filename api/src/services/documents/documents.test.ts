import { documents, document, createDocument, updateDocument, deleteDocument } from './documents'
import type { StandardScenario } from './documents.scenarios'

describe('documents', () => {
  scenario('returns all documents', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await documents()

    expect(result.length).toEqual(Object.keys(scenario.document).length)
  })

  scenario('returns a single document', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await document({ id: scenario.document.one.id })

    expect(result).toEqual(scenario.document.one)
  })

  scenario('creates a document', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await createDocument({ input: { title: 'String', body: 'String' } })

    expect(result.title).toEqual('String')
    expect(result.body).toEqual('String')
  })

  scenario('updates a document', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await document({ id: scenario.document.one.id })
    const result = await updateDocument({ id: original.id, input: { title: 'String2' } })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a document', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteDocument({ id: scenario.document.one.id })
    const result = await document({ id: original.id })

    expect(result).toEqual(null)
  })
})
