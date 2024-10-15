import { documents, document, createDocument, updateDocument, deleteDocument } from './documents'
import type { StandardScenario } from './documents.scenarios'

describe('documents', () => {
  scenario('returns all documents', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await documents()

    expect(result.length).toEqual(2)
  })

  scenario('returns a document owned by the authenticated user', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await document({ id: scenario.document.one.id })

    expect(result).toEqual(scenario.document.one)
  })

  scenario('returns a public document', async (scenario: StandardScenario) => {
    const result = await document({ id: scenario.document.public.id })

    expect(result).toEqual(scenario.document.public)
  })

  scenario('returns null if the user is not authorised to access the document.', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.jane)
    const result = await document({ id: scenario.document.one.id })

    expect(result).toEqual(null)
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
