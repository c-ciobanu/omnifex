import { db } from 'api/src/lib/db'
import { getTMDBMovie, getTMDBMovieDirector } from 'api/src/lib/tmdb'

export default async () => {
  const moviesToBackfill = await db.movie.findMany({ where: { director: null }, select: { id: true, tmdbId: true } })

  for (let index = 0; index < moviesToBackfill.length; index++) {
    const movie = moviesToBackfill[index]
    const [tmdbMovie, movieDirector] = await Promise.all([
      getTMDBMovie(movie.tmdbId),
      getTMDBMovieDirector(movie.tmdbId),
    ])

    await db.movie.update({
      where: { id: movie.id },
      data: {
        director: movieDirector,
        originalLanguage: tmdbMovie.original_language,
        originalTitle: tmdbMovie.original_title,
        tagline: tmdbMovie.tagline || null,
      },
    })
  }
}
