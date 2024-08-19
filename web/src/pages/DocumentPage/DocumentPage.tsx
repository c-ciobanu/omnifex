import DocumentCell from './DocumentCell'

type DocumentPageProps = {
  id: string
}

const DocumentPage = ({ id }: DocumentPageProps) => {
  return <DocumentCell id={id} />
}

export default DocumentPage
