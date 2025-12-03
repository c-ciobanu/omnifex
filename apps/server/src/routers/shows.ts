import { ORPCError } from "@orpc/server";
import * as z from "zod";

import type { Show, ShowEpisode, ShowSeason } from "@omnifex/db";
import { prisma } from "@omnifex/db";

import { adminProcedure, protectedProcedure, publicProcedure } from "../lib/orpc";
import { getTMDBShow, getTMDBShowSeason, searchTMDBShows } from "../lib/tmdb";
import { updateShowQueue } from "../queues";

const mapShow = (show: Show) => ({
  ...show,
  backdropUrl: show.tmdbBackdropPath ? `https://image.tmdb.org/t/p/w1280${show.tmdbBackdropPath}` : undefined,
  posterUrl: `https://image.tmdb.org/t/p/w342${show.tmdbPosterPath}`,
});

const mapSeason = <T extends ShowSeason>(season: T) => ({
  ...season,
  posterUrl: season.tmdbPosterPath ? `https://image.tmdb.org/t/p/w342${season.tmdbPosterPath}` : undefined,
});

const mapEpisode = (episode: ShowEpisode) => ({
  ...episode,
  stillUrl: episode.tmdbStillPath ? `https://image.tmdb.org/t/p/w342${episode.tmdbStillPath}` : undefined,
});

export const getUserShowProgress = async (id: number, userId: string) => {
  const show = await prisma.show.findUnique({
    where: { id },
    select: {
      _count: {
        select: {
          episodes: true,
          watchedEpisodes: { where: { userId: userId } },
          inWatchlist: { where: { userId: userId } },
          abandoned: { where: { userId: userId } },
        },
      },
    },
  });

  if (!show) {
    throw new ORPCError("INTERNAL_SERVER_ERROR");
  }

  return {
    watched: show._count.episodes === show._count.watchedEpisodes,
    watchedEpisodes: show._count.watchedEpisodes,
    watchedPercentage: Math.round((show._count.watchedEpisodes / show._count.episodes) * 100),
    inWatchlist: show._count.inWatchlist === 1,
    abandoned: show._count.abandoned === 1,
  };
};

export const isShowInWatchlist = async (id: number, userId: string) => {
  const count = await prisma.watchlistShow.count({ where: { showId: id, userId } });

  return count === 1;
};

const unwatchlistShow = async (id: number, userId: string) => {
  return prisma.watchlistShow.delete({ where: { userId_showId: { userId, showId: id } } });
};

const unabandonShow = async (id: number, userId: string) => {
  return prisma.abandonedShow.delete({ where: { userId_showId: { userId, showId: id } } });
};

export const showsRouter = {
  triggerManualUpdate: adminProcedure.input(z.object({ tmdbId: z.int() })).handler(async ({ input }) => {
    await updateShowQueue.add(input.tmdbId.toString(), input);
  }),

  find: publicProcedure.input(z.object({ title: z.string().min(1) })).handler(async ({ input }) => {
    const tmdbShows = await searchTMDBShows({ title: input.title });

    return tmdbShows.map((tmdbShow) => ({
      tmdbId: tmdbShow.id,
      overview: tmdbShow.overview,
      posterUrl: tmdbShow.poster_path ? `https://image.tmdb.org/t/p/w154${tmdbShow.poster_path}` : undefined,
      releaseYear: Number(tmdbShow.first_air_date.split("-")[0]),
      title: tmdbShow.name,
    }));
  }),

  get: publicProcedure.input(z.object({ tmdbId: z.int() })).handler(async ({ input, context }) => {
    const show = await prisma.show.findUnique({
      where: { tmdbId: input.tmdbId },
      include: {
        seasons: {
          include: {
            _count: {
              select: {
                episodes: true,
                watchedEpisodes: { where: { userId: context.session?.user.id } },
              },
            },
          },
          orderBy: { number: "asc" },
        },
        _count: {
          select: {
            episodes: true,
            watchedEpisodes: { where: { userId: context.session?.user.id } },
            inWatchlist: { where: { userId: context.session?.user.id } },
            abandoned: { where: { userId: context.session?.user.id } },
          },
        },
      },
    });

    if (show) {
      return {
        ...mapShow(show),
        seasons: show.seasons.map((season) => ({
          ...mapSeason(season),
          userProgress: context.session
            ? { watched: season._count.episodes === season._count.watchedEpisodes }
            : undefined,
        })),
        userProgress: context.session
          ? {
              watched: show._count.episodes === show._count.watchedEpisodes,
              watchedEpisodes: show._count.watchedEpisodes,
              watchedPercentage: Math.round((show._count.watchedEpisodes / show._count.episodes) * 100),
              inWatchlist: show._count.inWatchlist === 1,
              abandoned: show._count.abandoned === 1,
            }
          : undefined,
        episodesNumber: show._count.episodes,
      };
    }

    const tmdbShow = await getTMDBShow(input.tmdbId);
    const seasons = await Promise.all(
      tmdbShow.seasons
        .filter((s) => s.season_number !== 0)
        .map((s) => getTMDBShowSeason(input.tmdbId, s.season_number)),
    );

    const createdShow = await prisma.show.create({
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

    const dbSeasons = await prisma.showSeason.createManyAndReturn({
      data: seasons.map((season) => ({
        airDate: season.air_date ? new Date(season.air_date) : undefined,
        number: season.season_number,
        overview: season.overview,
        rating: Math.round(season.vote_average * 10) / 10,
        tmdbPosterPath: season.poster_path,
        showId: createdShow.id,
      })),
    });

    const showEpisodeCreateManyResponse = await prisma.showEpisode.createMany({
      data: dbSeasons.flatMap((dbSeason) => {
        const season = seasons.find((s) => s.season_number === dbSeason.number);

        if (!season) {
          return [];
        }

        return season.episodes.map((e) => ({
          airDate: e.air_date ? new Date(e.air_date) : undefined,
          number: e.episode_number,
          overview: e.overview,
          rating: Math.round(e.vote_average * 10) / 10,
          runtime: e.runtime,
          title: e.name,
          tmdbStillPath: e.still_path,
          seasonId: dbSeason.id,
          showId: createdShow.id,
        }));
      }),
    });

    return {
      ...mapShow(createdShow),
      seasons: dbSeasons.map((season) => ({
        ...mapSeason(season),
        userProgress: context.session ? { watched: false } : undefined,
      })),
      episodesNumber: showEpisodeCreateManyResponse.count,
      userProgress: context.session
        ? {
            watched: false,
            watchedEpisodes: 0,
            watchedPercentage: 0,
            inWatchlist: false,
            abandoned: false,
          }
        : undefined,
    };
  }),

  getSeason: publicProcedure
    .input(z.object({ showTmdbId: z.int(), seasonNumber: z.int() }))
    .handler(async ({ input, context }) => {
      const season = await prisma.showSeason.findFirst({
        where: { show: { tmdbId: input.showTmdbId }, number: input.seasonNumber },
        include: {
          show: true,
          episodes: { orderBy: { number: "asc" } },
          watchedEpisodes: { where: { userId: context.session?.user.id } },
        },
      });

      if (!season) {
        throw new ORPCError("NOT_FOUND");
      }

      return {
        ...mapSeason(season),
        episodes: season.episodes.map(mapEpisode),
        userProgress: context.session
          ? {
              watched: season.episodes.length === season.watchedEpisodes.length,
              watchedEpisodes: season.watchedEpisodes.length,
              watchedPercentage: Math.round((season.watchedEpisodes.length / season.episodes.length) * 100),
            }
          : undefined,
      };
    }),

  getWatched: protectedProcedure.handler(async ({ context }) => {
    const shows = await prisma.show.findMany({
      where: { watchedEpisodes: { some: { userId: context.session.user.id } } },
      include: {
        _count: {
          select: {
            episodes: true,
            watchedEpisodes: { where: { userId: context.session.user.id } },
          },
        },
      },
      orderBy: { title: "asc" },
    });

    const watchedShows = shows.filter((s) => s._count.watchedEpisodes === s._count.episodes);

    return watchedShows.map(mapShow);
  }),

  watch: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const showProgress = await getUserShowProgress(input.id, context.session.user.id);

    if (showProgress.inWatchlist) {
      await unwatchlistShow(input.id, context.session.user.id);
    }

    if (showProgress.abandoned) {
      await unabandonShow(input.id, context.session.user.id);
    }

    const episodes = await prisma.showEpisode.findMany({ where: { showId: input.id } });

    return prisma.watchedEpisode.createManyAndReturn({
      data: episodes.map((e) => ({
        userId: context.session.user.id,
        showId: e.showId,
        seasonId: e.seasonId,
        episodeId: e.id,
      })),
      skipDuplicates: true,
    });
  }),

  unwatch: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.watchedEpisode.deleteMany({ where: { userId: context.session.user.id, showId: input.id } });
  }),

  watchSeason: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const episodes = await prisma.showEpisode.findMany({ where: { seasonId: input.id } });
    const showId = episodes[0]?.showId;

    if (!showId) {
      throw new ORPCError("CONFLICT", { message: "No episodes found for this season" });
    }

    const inWatchlist = await isShowInWatchlist(showId, context.session.user.id);

    if (inWatchlist) {
      await unwatchlistShow(showId, context.session.user.id);
    }

    return prisma.watchedEpisode.createManyAndReturn({
      data: episodes.map((e) => ({
        userId: context.session.user.id,
        showId: e.showId,
        seasonId: e.seasonId,
        episodeId: e.id,
      })),
      skipDuplicates: true,
    });
  }),

  unwatchSeason: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.watchedEpisode.deleteMany({ where: { userId: context.session.user.id, seasonId: input.id } });
  }),

  watchEpisode: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const episode = await prisma.showEpisode.findUnique({ where: { id: input.id } });

    if (!episode) {
      throw new ORPCError("NOT_FOUND");
    }

    const showId = episode.showId;

    const inWatchlist = await isShowInWatchlist(showId, context.session.user.id);

    if (inWatchlist) {
      await unwatchlistShow(showId, context.session.user.id);
    }

    return prisma.watchedEpisode.create({
      data: {
        userId: context.session.user.id,
        showId: episode.showId,
        seasonId: episode.seasonId,
        episodeId: episode.id,
      },
    });
  }),

  unwatchEpisode: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.watchedEpisode.delete({
      where: { userId_episodeId: { userId: context.session.user.id, episodeId: input.id } },
    });
  }),

  getWatchlist: protectedProcedure.handler(async ({ context }) => {
    const shows = await prisma.show.findMany({
      where: {
        OR: [
          { watchedEpisodes: { some: { userId: context.session.user.id } } },
          {
            inWatchlist: { some: { userId: context.session.user.id } },
          },
        ],
        abandoned: { none: { userId: context.session.user.id } },
      },
      include: {
        episodes: {
          include: { season: true },
          where: { watched: { none: { userId: context.session.user.id } } },
          orderBy: [{ airDate: "asc" }, { number: "asc" }],
        },
        _count: {
          select: {
            episodes: true,
            watchedEpisodes: { where: { userId: context.session.user.id } },
          },
        },
      },
    });

    return shows
      .map((show) => {
        const lastEpisode = show.episodes.at(-1);
        const nextUserEpisode = show.episodes[0];

        if (!lastEpisode || !nextUserEpisode || show._count.watchedEpisodes === show._count.episodes) {
          return undefined;
        }

        return {
          ...mapShow(show),
          episodes: undefined,
          lastEpisode: { ...mapEpisode(lastEpisode), season: mapSeason(nextUserEpisode.season) },
          nextUserEpisode: {
            ...nextUserEpisode,
            season: mapSeason(nextUserEpisode.season),
          },
        };
      })
      .filter((show) => show !== undefined);
  }),

  watchlist: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const showProgress = await getUserShowProgress(input.id, context.session.user.id);

    if (showProgress.abandoned) {
      throw new ORPCError("CONFLICT", { message: "Unable to add an abandoned show to the watchlist" });
    }

    if (showProgress.watched) {
      throw new ORPCError("CONFLICT", { message: "Unable to add a watched show to the watchlist" });
    }

    return prisma.watchlistShow.create({ data: { userId: context.session.user.id, showId: input.id } });
  }),

  unwatchlist: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return unwatchlistShow(input.id, context.session.user.id);
  }),

  getAbandoned: protectedProcedure.handler(async ({ context }) => {
    const shows = await prisma.show.findMany({
      where: { abandoned: { some: { userId: context.session.user.id } } },
      orderBy: { title: "asc" },
    });

    return shows.map(mapShow);
  }),

  abandon: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const showProgress = await getUserShowProgress(input.id, context.session.user.id);

    if (showProgress.inWatchlist) {
      throw new ORPCError("CONFLICT", { message: "Unable to move a show from the watchlist to the abandoned list" });
    }

    if (showProgress.watched) {
      throw new ORPCError("CONFLICT", { message: "Unable to add a watched show to the abandoned list" });
    }

    return prisma.abandonedShow.create({ data: { userId: context.session.user.id, showId: input.id } });
  }),

  unabandon: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.abandonedShow.delete({
      where: { userId_showId: { userId: context.session.user.id, showId: input.id } },
    });
  }),
};
