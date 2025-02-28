import { db } from 'src/lib/db'
import { jobs } from 'src/lib/jobs'
import { getTMDBMovie } from 'src/lib/tmdb'

export const UpdateMovieJob = jobs.createJob({
  queue: 'default',
  perform: async (tmdbId: number) => {
    const tmdbMovie = await getTMDBMovie(tmdbId)
    const director = tmdbMovie.credits.crew.find((el) => el.job === 'Director')

    await db.movie.update({
      where: { tmdbId },
      data: {
        director: director.name,
        genres: tmdbMovie.genres.map((genre) => genre.name),
        imdbId: tmdbMovie.imdb_id,
        originalLanguage: tmdbMovie.original_language,
        originalTitle: tmdbMovie.original_title,
        overview: tmdbMovie.overview,
        rating: Math.round(tmdbMovie.vote_average * 10) / 10,
        releaseDate: new Date(tmdbMovie.release_date),
        runtime: tmdbMovie.runtime,
        tagline: tmdbMovie.tagline || undefined,
        title: tmdbMovie.title,
        tmdbId: tmdbMovie.id,
        tmdbPosterPath: tmdbMovie.poster_path,
      },
    })
  },
})
