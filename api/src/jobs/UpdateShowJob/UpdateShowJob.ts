import { db } from 'src/lib/db'
import { jobs } from 'src/lib/jobs'
import { getTMDBShow, getTMDBShowSeason } from 'src/lib/tmdb'

export const UpdateShowJob = jobs.createJob({
  queue: 'default',
  perform: async (tmdbId: number) => {
    const tmdbShow = await getTMDBShow(tmdbId)
    const tmdbSeasons = await Promise.all(
      tmdbShow.seasons.filter((s) => s.season_number !== 0).map((s) => getTMDBShowSeason(tmdbId, s.season_number))
    )

    const show = await db.show.update({
      where: { tmdbId },
      data: {
        creators: tmdbShow.created_by.map((person) => person.name),
        genres: tmdbShow.genres.map((genre) => genre.name),
        imdbId: tmdbShow.external_ids.imdb_id,
        originalLanguage: tmdbShow.original_language,
        originalTitle: tmdbShow.original_name,
        overview: tmdbShow.overview,
        rating: Math.round(tmdbShow.vote_average * 10) / 10,
        tagline: tmdbShow.tagline || undefined,
        title: tmdbShow.name,
        tmdbBackdropPath: tmdbShow.backdrop_path,
        tmdbId: tmdbShow.id,
        tmdbPosterPath: tmdbShow.poster_path,
      },
    })

    for (const tmdbSeason of tmdbSeasons) {
      const season = await db.showSeason.update({
        where: { showId_number: { showId: show.id, number: tmdbSeason.season_number } },
        data: {
          airDate: tmdbSeason.air_date ? new Date(tmdbSeason.air_date) : undefined,
          number: tmdbSeason.season_number,
          overview: tmdbSeason.overview,
          rating: Math.round(tmdbSeason.vote_average * 10) / 10,
          tmdbPosterPath: tmdbSeason.poster_path,
        },
      })

      for (const tmdbEpisode of tmdbSeason.episodes) {
        await db.showEpisode.update({
          where: { seasonId_number: { seasonId: season.id, number: tmdbEpisode.episode_number } },
          data: {
            airDate: tmdbEpisode.air_date ? new Date(tmdbEpisode.air_date) : undefined,
            number: tmdbEpisode.episode_number,
            overview: tmdbEpisode.overview,
            rating: Math.round(tmdbEpisode.vote_average * 10) / 10,
            runtime: tmdbEpisode.runtime,
            title: tmdbEpisode.name,
            tmdbStillPath: tmdbEpisode.still_path,
          },
        })
      }
    }
  },
})
