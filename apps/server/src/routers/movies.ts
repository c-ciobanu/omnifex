import { ORPCError } from "@orpc/server";
import * as z from "zod";

import type { Movie } from "@omnifex/db";
import { MovieListType, prisma } from "@omnifex/db";

import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { getTMDBMovie, searchTMDBMovies } from "../lib/tmdb";

const mapMovie = (movie: Movie) => ({
  ...movie,
  posterUrl: `https://image.tmdb.org/t/p/w342${movie.tmdbPosterPath}`,
});

const isMovieWatched = async (id: number, userId: string) => {
  const count = await prisma.movieListItem.count({
    where: { movieId: id, list: { type: MovieListType.WATCHLIST, userId } },
  });

  return count === 1;
};

const isMovieInWatchlist = async (id: number, userId: string) => {
  const count = await prisma.movieListItem.count({
    where: { list: { type: MovieListType.WATCHLIST, userId }, movieId: id },
  });

  return count === 1;
};

const unwatchlistMovie = async (id: number, userId: string) => {
  const list = await prisma.movieList.findFirst({
    where: { userId, type: MovieListType.WATCHLIST },
    select: { id: true },
  });

  if (!list) {
    throw new ORPCError("INTERNAL_SERVER_ERROR");
  }

  return prisma.movieListItem.delete({ where: { listId_movieId: { listId: list.id, movieId: id } } });
};

export const moviesRouter = {
  find: publicProcedure.input(z.object({ title: z.string().min(1) })).handler(async ({ input }) => {
    const tmdbMovies = await searchTMDBMovies({ title: input.title });

    return tmdbMovies
      .filter((tmdbMovie) => tmdbMovie.release_date)
      .map((tmdbMovie) => ({
        tmdbId: tmdbMovie.id,
        overview: tmdbMovie.overview,
        posterUrl: `https://image.tmdb.org/t/p/w154${tmdbMovie.poster_path}`,
        releaseYear: Number(tmdbMovie.release_date.split("-")[0]),
        title: tmdbMovie.title,
      }));
  }),

  get: publicProcedure.input(z.object({ tmdbId: z.int() })).handler(async ({ input, context }) => {
    let movie = await prisma.movie.findUnique({ where: { tmdbId: input.tmdbId } });

    if (!movie) {
      const tmdbMovie = await getTMDBMovie(input.tmdbId);
      const director = tmdbMovie.credits.crew.find((el) => el.job === "Director");

      movie = await prisma.movie.create({
        data: {
          director: director?.name,
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
      });
    }

    let userInfo;
    if (context.session) {
      const movieListItems = await prisma.movieListItem.findMany({
        where: { list: { type: { not: MovieListType.CUSTOM }, userId: context.session.user.id }, movieId: movie.id },
        select: { list: { select: { type: true } } },
      });

      userInfo = {
        watched: movieListItems.some((item) => item.list.type === MovieListType.WATCHED),
        inWatchlist: movieListItems.some((item) => item.list.type === MovieListType.WATCHLIST),
      };
    }

    return { ...mapMovie(movie), userInfo };
  }),

  getWatched: protectedProcedure.handler(async ({ context }) => {
    const movieListItems = await prisma.movieList
      .findFirst({ where: { type: MovieListType.WATCHED, userId: context.session.user.id } })
      .movies({ select: { movie: true } });

    if (!movieListItems) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return movieListItems.map((listItem) => mapMovie(listItem.movie));
  }),

  watch: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const inWatchlist = await isMovieInWatchlist(input.id, context.session.user.id);

    if (inWatchlist) {
      await unwatchlistMovie(input.id, context.session.user.id);
    }

    const list = await prisma.movieList.findFirst({
      where: { userId: context.session.user.id, type: MovieListType.WATCHED },
      select: { id: true },
    });

    if (!list) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return prisma.movieListItem.create({ data: { listId: list.id, movieId: input.id } });
  }),

  unwatch: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const list = await prisma.movieList.findFirst({
      where: { userId: context.session.user.id, type: MovieListType.WATCHED },
      select: { id: true },
    });

    if (!list) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return prisma.movieListItem.delete({ where: { listId_movieId: { listId: list.id, movieId: input.id } } });
  }),

  getWatchlist: protectedProcedure.handler(async ({ context }) => {
    const movieListItems = await prisma.movieList
      .findFirst({ where: { type: MovieListType.WATCHLIST, userId: context.session.user.id } })
      .movies({ select: { movie: true } });

    if (!movieListItems) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return movieListItems.map((listItem) => mapMovie(listItem.movie));
  }),

  watchlist: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const watched = await isMovieWatched(input.id, context.session.user.id);

    if (watched) {
      throw new ORPCError("CONFLICT", { message: "Unable to add a watched movie to the watchlist" });
    }

    const list = await prisma.movieList.findFirst({
      where: { userId: context.session.user.id, type: MovieListType.WATCHLIST },
      select: { id: true },
    });

    if (!list) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return prisma.movieListItem.create({ data: { listId: list.id, movieId: input.id } });
  }),

  unwatchlist: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return unwatchlistMovie(input.id, context.session.user.id);
  }),
};
