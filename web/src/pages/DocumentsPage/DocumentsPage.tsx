import { Metadata } from '@redwoodjs/web'

import DocumentsCell from './DocumentsCell'

const DocumentsPage = () => {
  return (
    <>
      <Metadata title="Documents" robots="noindex" />

      <DocumentsCell />
    </>
  )
}

export default DocumentsPage
