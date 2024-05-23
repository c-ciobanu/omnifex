import { useEffect, useState } from 'react'

import { BlockCollection } from '@blocksuite/store'

import { useEditor } from '../EditorContext/EditorContext'

export const Sidebar = () => {
  const { collection, editor } = useEditor()
  const [docs, setDocs] = useState<BlockCollection[]>([])

  useEffect(() => {
    if (!collection || !editor) return

    const updateDocs = () => setDocs([...collection.docs.values()])
    updateDocs()

    const disposable = [collection.slots.docUpdated.on(updateDocs), editor.slots.docLinkClicked.on(updateDocs)]

    return () => disposable.forEach((d) => d.dispose())
  }, [collection, editor])

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">All Docs</h2>

      <div className="flex flex-col gap-2">
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
    </div>
  )
}
