import type { Prisma, Movie, User, MovieList } from '@prisma/client'
import { MovieListItem } from 'types/graphql'

export const standard = defineScenario<
  Prisma.MovieCreateArgs | Prisma.UserCreateArgs | Prisma.MovieListCreateArgs | Prisma.MovieListItemCreateArgs
>({
  movie: {
    inception: {
      data: {
        director: 'Christopher Nolan',
        genres: ['Action', 'Science Fiction', 'Adventure'],
        imdbId: 'tt1375666',
        originalLanguage: 'en',
        originalTitle: 'Inception',
        overview:
          'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
        rating: '8.4',
        releaseDate: new Date('2010-07-15'),
        runtime: 148,
        tagline: 'Your mind is the scene of the crime.',
        title: 'Inception',
        tmdbId: 27205,
        tmdbPosterPath: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    },
    se7en: {
      data: {
        director: 'David Fincher',
        genres: ['Crime', 'Mystery', 'Thriller'],
        imdbId: 'tt0114369',
        originalLanguage: 'en',
        originalTitle: 'Se7en',
        overview:
          'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the "seven deadly sins" in this dark and haunting film that takes viewers from the tortured remains of one victim to the next. The seasoned Det. Sommerset researches each sin in an effort to get inside the killer\'s mind, while his novice partner, Mills, scoffs at his efforts to unravel the case.',
        rating: '8.4',
        releaseDate: new Date('1995-09-22'),
        runtime: 127,
        tagline: 'Seven deadly sins. Seven ways to die.',
        title: 'Se7en',
        tmdbId: 807,
        tmdbPosterPath: '/6yoghtyTpznpBik8EngEmJskVUO.jpg',
      },
    },
    broker: {
      data: {
        director: 'Hirokazu Kore-eda',
        genres: ['Drama', 'Comedy', 'Crime'],
        imdbId: 'tt13056052',
        originalLanguage: 'ko',
        originalTitle: '브로커',
        overview:
          'Sang-hyun is always struggling from debt, and Dong-soo works at a baby box facility. On a rainy night, they steal the baby Woo-sung, who was left in the baby box, to sell him at a good price. Meanwhile, detectives were watching, and they quietly track them down to capture the crucial evidence.',
        rating: '7.2',
        releaseDate: new Date('2022-06-08'),
        runtime: 129,
        tagline: 'Some leave. Some retrieve.',
        title: 'Broker',
        tmdbId: 736732,
        tmdbPosterPath: '/x86xaUnxU31JYiwlO35corDEV1i.jpg',
      },
    },
  },
  user: {
    john: (scenario) => ({
      data: {
        username: 'john',
        hashedPassword: 'String',
        salt: 'String',
        movieLists: {
          create: [{ name: 'Watched', movies: { create: { movieId: scenario.movie.broker.id } } }],
        },
      },
    }),
    jane: {
      data: {
        username: 'jane',
        hashedPassword: 'String',
        salt: 'String',
      },
    },
  },
  movieList: {
    one: (scenario) => ({
      data: {
        name: 'Watchlist',
        userId: scenario.user.john.id,
      },
    }),
    two: (scenario) => ({
      data: {
        name: 'Watchlist',
        userId: scenario.user.jane.id,
        movies: {
          create: [
            {
              movieId: scenario.movie.inception.id,
            },
          ],
        },
      },
    }),
  },
  movieListItem: {
    one: (scenario) => ({
      data: {
        listId: scenario.movieList.one.id,
        movieId: scenario.movie.inception.id,
      },
    }),
  },
})

export type StandardScenario = {
  movie: Record<'inception' | 'se7en' | 'broker', Movie>
  user: Record<'john', User>
  movieList: Record<'one' | 'two', MovieList>
  movieListItem: Record<'one', MovieListItem>
}
