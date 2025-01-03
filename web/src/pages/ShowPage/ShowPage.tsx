import ShowCell from './ShowCell'

type ShowPageProps = {
  tmdbId: number
}

const ShowPage = ({ tmdbId }: ShowPageProps) => {
  return <ShowCell tmdbId={tmdbId} />
}

export default ShowPage
