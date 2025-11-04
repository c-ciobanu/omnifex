import { Worker } from "bullmq";

import { prisma } from "@omnifex/db";

import type { UpdateMovieDataType } from "../queues/index";
import { getTMDBMovie } from "../lib/tmdb";
import { updateMovieQueue } from "../queues/index";
import { defaultWorkerOptions } from "./config";

export const updateMovieWorker = new Worker<UpdateMovieDataType>(
  updateMovieQueue.name,
  async (job) => {
    const { tmdbId } = job.data;

    const tmdbMovie = await getTMDBMovie(tmdbId);
    const director = tmdbMovie.credits.crew.find((el) => el.job === "Director");

    await prisma.movie.update({
      where: { tmdbId },
      data: {
        director: director?.name ?? null,
        genres: tmdbMovie.genres.map((genre) => genre.name),
        imdbId: tmdbMovie.imdb_id,
        originalLanguage: tmdbMovie.original_language,
        originalTitle: tmdbMovie.original_title,
        overview: tmdbMovie.overview,
        rating: Math.round(tmdbMovie.vote_average * 10) / 10,
        releaseDate: new Date(tmdbMovie.release_date),
        runtime: tmdbMovie.runtime,
        tagline: tmdbMovie.tagline || null,
        title: tmdbMovie.title,
        tmdbId: tmdbMovie.id,
        tmdbPosterPath: tmdbMovie.poster_path,
      },
    });
  },
  defaultWorkerOptions,
);
