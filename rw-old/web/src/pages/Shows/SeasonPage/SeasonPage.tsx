import SeasonCell from './SeasonCell'

type SeasonPageProps = {
  tmdbId: number
  number: number
}

const SeasonPage = ({ tmdbId, number }: SeasonPageProps) => {
  return <SeasonCell showTmdbId={tmdbId} seasonNumber={number} />
}

export default SeasonPage
