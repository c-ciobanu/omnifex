import { Metadata } from '@redwoodjs/web'

import LexicalEditor from './LexicalEditor/LexicalEditor'

type DocumentPageProps = {
  id: string
}

const DocumentPage = ({ id }: DocumentPageProps) => {
  return (
    <>
      <Metadata title={`Document ${id}`} />

      <LexicalEditor />
    </>
  )
}

export default DocumentPage
