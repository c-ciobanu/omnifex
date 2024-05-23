import { Metadata } from '@redwoodjs/web'

import { Editor } from './Editor/Editor'
import { EditorProvider } from './EditorContext/EditorContext'
import { Sidebar } from './Sidebar/Sidebar'

const DocumentsPage = () => {
  return (
    <>
      <Metadata title="Documents" />

      <EditorProvider>
        <div className="flex gap-8">
          <Sidebar />

          <div className="flex-1">
            <Editor />
          </div>
        </div>
      </EditorProvider>
    </>
  )
}

export default DocumentsPage
