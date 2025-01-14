import SeasonCell from './SeasonCell'

type ShowSeasonPageProps = {
  tmdbId: number
  number: number
}

const ShowSeasonPage = ({ tmdbId, number }: ShowSeasonPageProps) => {
  return <SeasonCell showTmdbId={tmdbId} seasonNumber={number} />
}

export default ShowSeasonPage
