import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

type MoviePageProps = {
  id: number
}

const MoviePage = ({ id }: MoviePageProps) => {
  return (
    <>
      <MetaTags title="Movies" description="Movies page" />

      <h1>MoviesPage {id}</h1>
      <p>
        Find me in <code>./web/src/pages/MoviesPage/MoviesPage.tsx</code>
      </p>
      <p>
        My default route is named <code>movies</code>, link to me with `
        <Link to={routes.movie({ id: 1 })}>Movies</Link>`
      </p>
    </>
  )
}

export default MoviePage
