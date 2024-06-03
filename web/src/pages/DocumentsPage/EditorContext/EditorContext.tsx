import { createContext, useContext, useEffect, useState } from 'react'

import { AffineSchemas, ZipTransformer } from '@blocksuite/blocks'
import { AffineEditorContainer } from '@blocksuite/presets'
import { Doc, DocCollection, Schema } from '@blocksuite/store'
import { DocumentsUrlQuery, DocumentsUrlQueryVariables } from 'types/graphql'

import { TypedDocumentNode, useQuery } from '@redwoodjs/web'

import '@blocksuite/presets/themes/affine.css'

const DOCUMENTS_URL: TypedDocumentNode<DocumentsUrlQuery, DocumentsUrlQueryVariables> = gql`
  query DocumentsUrlQuery {
    documentsUrl
  }
`

interface EditorContext {
  editor: AffineEditorContainer | null
  collection: DocCollection | null
}

const EditorContext = createContext<EditorContext | null>(null)

async function initEditor(blob?: Blob) {
  const schema = new Schema().register(AffineSchemas)
  const collection = new DocCollection({ schema })

  let docs: Doc[]
  if (blob) {
    docs = await ZipTransformer.importDocs(collection, blob)
  } else {
    docs = [collection.createDoc()]

    const doc = docs[0]
    doc.load(() => {
      const pageBlockId = doc.addBlock('affine:page', {})
      doc.addBlock('affine:surface', {}, pageBlockId)
      for (let index = 0; index < 3; index++) {
        const noteId = doc.addBlock('affine:note', {}, pageBlockId)
        doc.addBlock('affine:paragraph', {}, noteId)
      }
    })
  }

  const editor = new AffineEditorContainer()
  editor.doc = docs[0]

  editor.slots.docLinkClicked.on(({ docId }) => {
    const target = collection.getDoc(docId)
    editor.doc = target
  })

  return { editor, collection }
}

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useQuery(DOCUMENTS_URL)
  const [editor, setEditor] = useState<AffineEditorContainer | null>(null)
  const [collection, setCollection] = useState<DocCollection | null>(null)

  useEffect(() => {
    async function fetchDocsAndInitEditor(url: string) {
      const response = await fetch(url)

      let blob: Blob | undefined
      if (response.ok) {
        blob = await response.blob()
      }

      const { editor, collection } = await initEditor(blob)

      setEditor(editor)
      setCollection(collection)
    }

    if (data) {
      fetchDocsAndInitEditor(data.documentsUrl)
    }
  }, [data])

  return <EditorContext.Provider value={{ editor, collection }}>{children}</EditorContext.Provider>
}

export function useEditor() {
  return useContext(EditorContext)
}
