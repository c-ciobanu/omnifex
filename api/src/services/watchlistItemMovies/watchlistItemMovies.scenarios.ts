import type { Prisma, Movie, User, WatchlistItemMovie, WatchedMovie } from '@prisma/client'

export const standard = defineScenario<
  Prisma.MovieCreateArgs | Prisma.UserCreateArgs | Prisma.WatchlistItemMovieCreateArgs | Prisma.WatchedMovieCreateArgs
>({
  movie: {
    interstellar: {
      data: {
        genres: ['Adventure', 'Drama', 'Science Fiction'],
        imdbId: 'tt0816692',
        overview:
          'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
        rating: 8.4,
        releaseDate: new Date('2014-11-05'),
        runtime: 169,
        tagline: 'Mankind was born on Earth. It was never meant to die here.',
        title: 'Interstellar',
        tmdbId: 157336,
        tmdbPosterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      },
    },
    se7en: {
      data: {
        genres: ['Crime', 'Mystery', 'Thriller'],
        imdbId: 'tt0114369',
        overview:
          'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the "seven deadly sins" in this dark and haunting film that takes viewers from the tortured remains of one victim to the next. The seasoned Det. Sommerset researches each sin in an effort to get inside the killer\'s mind, while his novice partner, Mills, scoffs at his efforts to unravel the case.',
        rating: 8.4,
        releaseDate: new Date('1995-09-22'),
        runtime: 127,
        tagline: 'Seven deadly sins. Seven ways to die.',
        title: 'Se7en',
        tmdbId: 807,
        tmdbPosterPath: '/6yoghtyTpznpBik8EngEmJskVUO.jpg',
      },
    },
    parasite: {
      data: {
        genres: ['Comedy', 'Thriller', 'Drama'],
        imdbId: 'tt6751668',
        overview:
          "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
        rating: 8.5,
        releaseDate: new Date('2019-05-30'),
        runtime: 133,
        tagline: 'Act like you own the place.',
        title: 'Parasite',
        tmdbId: 496243,
        tmdbPosterPath: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      },
    },
  },
  user: {
    john: {
      data: {
        email: 'john@doe.com',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  watchlistItemMovie: {
    one: (scenario) => ({
      data: {
        movieId: scenario.movie.interstellar.id,
        userId: scenario.user.john.id,
      },
    }),
  },
  watchedMovie: {
    one: (scenario) => ({
      data: {
        movieId: scenario.movie.se7en.id,
        userId: scenario.user.john.id,
      },
    }),
  },
})

export type StandardScenario = {
  movie: Record<'interstellar' | 'se7en' | 'parasite', Movie>
  user: Record<'john', User>
  watchlistItemMovie: Record<'one', WatchlistItemMovie>
  watchedMovie: Record<'one', WatchedMovie>
}
