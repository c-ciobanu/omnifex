import type { Prisma, Movie, User, FavoritedMovie, WatchedMovie, ToWatchMovie } from '@prisma/client'

export const favorited = defineScenario<
  Prisma.MovieCreateArgs | Prisma.UserCreateArgs | Prisma.FavoritedMovieCreateArgs
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
  },
  user: {
    john: {
      data: {
        username: 'john',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  favoritedMovie: {
    one: (scenario) => ({
      data: {
        movieId: scenario.movie.interstellar.id,
        userId: scenario.user.john.id,
      },
    }),
  },
})

export type FavoritedScenario = {
  movie: Record<'interstellar' | 'se7en', Movie>
  user: Record<'john', User>
  favoritedMovie: Record<'one', FavoritedMovie>
}

export const watched = defineScenario<
  Prisma.MovieCreateArgs | Prisma.UserCreateArgs | Prisma.WatchedMovieCreateArgs | Prisma.ToWatchMovieCreateArgs
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
        username: 'john',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  watchedMovie: {
    one: (scenario) => ({
      data: {
        movieId: scenario.movie.interstellar.id,
        userId: scenario.user.john.id,
      },
    }),
  },
  toWatchMovie: {
    one: (scenario) => ({
      data: {
        movieId: scenario.movie.se7en.id,
        userId: scenario.user.john.id,
      },
    }),
  },
})

export type WatchedScenario = {
  movie: Record<'interstellar' | 'se7en' | 'parasite', Movie>
  user: Record<'john', User>
  watchedMovie: Record<'one', WatchedMovie>
  toWatchMovie: Record<'one', ToWatchMovie>
}

export const toWatch = defineScenario<
  Prisma.MovieCreateArgs | Prisma.UserCreateArgs | Prisma.ToWatchMovieCreateArgs | Prisma.WatchedMovieCreateArgs
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
        username: 'john',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  toWatchMovie: {
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

export type ToWatchScenario = {
  movie: Record<'interstellar' | 'se7en' | 'parasite', Movie>
  user: Record<'john', User>
  toWatchMovie: Record<'one', ToWatchMovie>
  watchedMovie: Record<'one', WatchedMovie>
}
