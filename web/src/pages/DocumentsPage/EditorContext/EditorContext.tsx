import { createContext, useContext } from 'react'

import { AffineSchemas } from '@blocksuite/blocks'
import { AffineEditorContainer } from '@blocksuite/presets'
import { DocCollection, Schema } from '@blocksuite/store'
import '@blocksuite/presets/themes/affine.css'

interface EditorContext {
  editor: AffineEditorContainer | null
  collection: DocCollection | null
}

const EditorContext = createContext<EditorContext | null>(null)

export function initEditor() {
  const schema = new Schema().register(AffineSchemas)
  const collection = new DocCollection({ schema })
  const doc = collection.createDoc()

  doc.load(() => {
    const pageBlockId = doc.addBlock('affine:page', {})
    doc.addBlock('affine:surface', {}, pageBlockId)
    for (let index = 0; index < 3; index++) {
      const noteId = doc.addBlock('affine:note', {}, pageBlockId)
      doc.addBlock('affine:paragraph', {}, noteId)
    }
  })

  const editor = new AffineEditorContainer()
  editor.doc = doc

  editor.slots.docLinkClicked.on(({ docId }) => {
    const target = collection.getDoc(docId)
    editor.doc = target
  })

  return { editor, collection }
}

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const { editor, collection } = initEditor()

  return <EditorContext.Provider value={{ editor, collection }}>{children}</EditorContext.Provider>
}

export function useEditor() {
  return useContext(EditorContext)
}
