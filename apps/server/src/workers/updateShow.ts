import { Worker } from "bullmq";

import { prisma } from "@omnifex/db";

import type { UpdateShowDataType } from "../queues/index";
import { getTMDBShow, getTMDBShowSeason } from "../lib/tmdb";
import { updateShowQueue } from "../queues/index";
import { defaultWorkerOptions } from "./config";

export const updateShowWorker = new Worker<UpdateShowDataType>(
  updateShowQueue.name,
  async (job) => {
    const { tmdbId } = job.data;

    const tmdbShow = await getTMDBShow(tmdbId);
    const tmdbSeasons = await Promise.all(
      tmdbShow.seasons.filter((s) => s.season_number !== 0).map((s) => getTMDBShowSeason(tmdbId, s.season_number)),
    );

    const show = await prisma.show.update({
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
    });

    for (const tmdbSeason of tmdbSeasons) {
      const seasonData = {
        airDate: tmdbSeason.air_date ? new Date(tmdbSeason.air_date) : undefined,
        number: tmdbSeason.season_number,
        overview: tmdbSeason.overview,
        rating: Math.round(tmdbSeason.vote_average * 10) / 10,
        tmdbPosterPath: tmdbSeason.poster_path,
      };
      const season = await prisma.showSeason.upsert({
        where: { showId_number: { showId: show.id, number: tmdbSeason.season_number } },
        update: seasonData,
        create: { ...seasonData, showId: show.id },
      });

      for (const tmdbEpisode of tmdbSeason.episodes) {
        const episodeData = {
          airDate: tmdbEpisode.air_date ? new Date(tmdbEpisode.air_date) : undefined,
          number: tmdbEpisode.episode_number,
          overview: tmdbEpisode.overview,
          rating: Math.round(tmdbEpisode.vote_average * 10) / 10,
          runtime: tmdbEpisode.runtime,
          title: tmdbEpisode.name,
          tmdbStillPath: tmdbEpisode.still_path,
        };
        await prisma.showEpisode.upsert({
          where: { seasonId_number: { seasonId: season.id, number: tmdbEpisode.episode_number } },
          update: episodeData,
          create: { ...episodeData, showId: show.id, seasonId: season.id },
        });
      }
    }
  },
  defaultWorkerOptions,
);
