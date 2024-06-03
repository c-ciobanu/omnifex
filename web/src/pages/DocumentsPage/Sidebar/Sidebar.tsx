import { useEffect, useState } from 'react'

import { ZipTransformer } from '@blocksuite/blocks'
import { BlockCollection } from '@blocksuite/store'

import { useMutation } from '@redwoodjs/web'

import { useEditor } from '../EditorContext/EditorContext'

const CREATE_DOCUMENTS_UPLOAD_URL = gql`
  mutation CreateDocumentsUploadUrlMutation {
    createDocumentsUploadUrl
  }
`

export const Sidebar = () => {
  const { collection, editor } = useEditor()
  const [docs, setDocs] = useState<BlockCollection[]>([])
  const [createDocumentsUploadUrl, { loading }] = useMutation(CREATE_DOCUMENTS_UPLOAD_URL, {
    async onCompleted(data) {
      const file = await ZipTransformer.exportDocs(
        collection,
        docs.map((collection) => collection.getDoc())
      )

      await fetch(data.createDocumentsUploadUrl, { method: 'PUT', body: file })
    },
  })

  useEffect(() => {
    if (!collection || !editor) return

    const updateDocs = () => setDocs([...collection.docs.values()])
    updateDocs()

    const disposable = [collection.slots.docUpdated.on(updateDocs), editor.slots.docLinkClicked.on(updateDocs)]

    return () => disposable.forEach((d) => d.dispose())
  }, [collection, editor])

  return (
    <div>
      <h2 className="text-2xl font-bold">My Docs</h2>

      <div className="my-4 flex flex-col gap-2">
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => {
              editor.doc = collection.getDoc(doc.id)
            }}
            className="text-left"
          >
            {doc.meta.title || 'Untitled'}
          </button>
        ))}
      </div>

      <button
        onClick={() => createDocumentsUploadUrl()}
        disabled={loading}
        className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
      >
        Save
      </button>
    </div>
  )
}
