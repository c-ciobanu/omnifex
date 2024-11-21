import { db } from 'api/src/lib/db'
import { minioClient } from 'api/src/lib/minio'
import { DefaultBookLists } from 'common'
import { DefaultMovieLists } from 'common'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import processExercises from './processExercises'

const range = (start: number, stop: number, step = 1) => {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)
}

const movies = [
  {
    genres: ['Drama', 'Crime'],
    imdbId: 'tt0111161',
    overview:
      'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.',
    rating: '8.7',
    releaseDate: new Date('1994-09-23'),
    runtime: 142,
    tagline: 'Fear can hold you prisoner. Hope can set you free.',
    title: 'The Shawshank Redemption',
    tmdbId: 278,
    tmdbPosterPath: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    director: 'Frank Darabont',
    originalLanguage: 'en',
    originalTitle: 'The Shawshank Redemption',
  },
  {
    genres: ['Drama', 'Crime'],
    imdbId: 'tt0068646',
    overview:
      'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.',
    rating: '8.7',
    releaseDate: new Date('1972-03-14'),
    runtime: 175,
    tagline: "An offer you can't refuse.",
    title: 'The Godfather',
    tmdbId: 238,
    tmdbPosterPath: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    director: 'Francis Ford Coppola',
    originalLanguage: 'en',
    originalTitle: 'The Godfather',
  },
  {
    genres: ['Drama', 'Action', 'Crime', 'Thriller'],
    imdbId: 'tt0468569',
    overview:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    rating: '8.5',
    releaseDate: new Date('2008-07-16'),
    runtime: 152,
    tagline: 'Welcome to a world without rules.',
    title: 'The Dark Knight',
    tmdbId: 155,
    tmdbPosterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    director: 'Christopher Nolan',
    originalLanguage: 'en',
    originalTitle: 'The Dark Knight',
  },
  {
    genres: ['Drama', 'Crime'],
    imdbId: 'tt0071562',
    overview:
      'In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.',
    rating: '8.6',
    releaseDate: new Date('1974-12-20'),
    runtime: 202,
    tagline: 'The rise and fall of the Corleone empire.',
    title: 'The Godfather Part II',
    tmdbId: 240,
    tmdbPosterPath: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg',
    director: 'Francis Ford Coppola',
    originalLanguage: 'en',
    originalTitle: 'The Godfather Part II',
  },
  {
    genres: ['Drama'],
    imdbId: 'tt0050083',
    overview:
      "The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors' prejudices and preconceptions about the trial, the accused, and each other.",
    rating: '8.5',
    releaseDate: new Date('1957-04-10'),
    runtime: 97,
    tagline: 'Life is in their hands — Death is on their minds!',
    title: '12 Angry Men',
    tmdbId: 389,
    tmdbPosterPath: '/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',
    director: 'Sidney Lumet',
    originalLanguage: 'en',
    originalTitle: '12 Angry Men',
  },
  {
    genres: ['Drama', 'History', 'War'],
    imdbId: 'tt0108052',
    overview:
      'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.',
    rating: '8.6',
    releaseDate: new Date('1993-12-15'),
    runtime: 195,
    tagline: 'Whoever saves one life, saves the world entire.',
    title: "Schindler's List",
    tmdbId: 424,
    tmdbPosterPath: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    director: 'Steven Spielberg',
    originalLanguage: 'en',
    originalTitle: "Schindler's List",
  },
  {
    genres: ['Adventure', 'Fantasy', 'Action'],
    imdbId: 'tt0167260',
    overview:
      'As armies mass for a final battle that will decide the fate of the world--and powerful, ancient forces of Light and Dark compete to determine the outcome--one member of the Fellowship of the Ring is revealed as the noble heir to the throne of the Kings of Men. Yet, the sole hope for triumph over evil lies with a brave hobbit, Frodo, who, accompanied by his loyal friend Sam and the hideous, wretched Gollum, ventures deep into the very dark heart of Mordor on his seemingly impossible quest to destroy the Ring of Power.​',
    rating: '8.5',
    releaseDate: new Date('2003-12-17'),
    runtime: 201,
    tagline: 'There can be no triumph without loss. No victory without suffering. No freedom without sacrifice.',
    title: 'The Lord of the Rings: The Return of the King',
    tmdbId: 122,
    tmdbPosterPath: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    director: 'Peter Jackson',
    originalLanguage: 'en',
    originalTitle: 'The Lord of the Rings: The Return of the King',
  },
  {
    genres: ['Thriller', 'Crime'],
    imdbId: 'tt0110912',
    overview:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    rating: '8.5',
    releaseDate: new Date('1994-09-10'),
    runtime: 154,
    tagline: "You won't know the facts until you've seen the fiction.",
    title: 'Pulp Fiction',
    tmdbId: 680,
    tmdbPosterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    director: 'Quentin Tarantino',
    originalLanguage: 'en',
    originalTitle: 'Pulp Fiction',
  },
  {
    genres: ['Adventure', 'Fantasy', 'Action'],
    imdbId: 'tt0120737',
    overview:
      'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.',
    rating: '8.4',
    releaseDate: new Date('2001-12-18'),
    runtime: 179,
    tagline: 'One ring to rule them all.',
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    tmdbId: 120,
    tmdbPosterPath: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    director: 'Peter Jackson',
    originalLanguage: 'en',
    originalTitle: 'The Lord of the Rings: The Fellowship of the Ring',
  },
  {
    genres: ['Western'],
    imdbId: 'tt0060196',
    overview:
      'While the Civil War rages on between the Union and the Confederacy, three men – a quiet loner, a ruthless hitman, and a Mexican bandit – comb the American Southwest in search of a strongbox containing $200,000 in stolen gold.',
    rating: '8.5',
    releaseDate: new Date('1966-12-22'),
    runtime: 161,
    tagline: "For three men the Civil War wasn't hell. It was practice.",
    title: 'The Good, the Bad and the Ugly',
    tmdbId: 429,
    tmdbPosterPath: '/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg',
    director: 'Sergio Leone',
    originalLanguage: 'it',
    originalTitle: 'Il buono, il brutto, il cattivo',
  },
  {
    genres: ['Comedy', 'Drama', 'Romance'],
    imdbId: 'tt0109830',
    overview:
      'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.',
    rating: '8.5',
    releaseDate: new Date('1994-06-23'),
    runtime: 142,
    tagline: "The world will never be the same once you've seen it through the eyes of Forrest Gump.",
    title: 'Forrest Gump',
    tmdbId: 13,
    tmdbPosterPath: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    director: 'Robert Zemeckis',
    originalLanguage: 'en',
    originalTitle: 'Forrest Gump',
  },
  {
    genres: ['Adventure', 'Fantasy', 'Action'],
    imdbId: 'tt0167261',
    overview:
      "Frodo Baggins and the other members of the Fellowship continue on their sacred quest to destroy the One Ring--but on separate paths. Their destinies lie at two towers--Orthanc Tower in Isengard, where the corrupt wizard Saruman awaits, and Sauron's fortress at Barad-dur, deep within the dark lands of Mordor. Frodo and Sam are trekking to Mordor to destroy the One Ring of Power while Gimli, Legolas and Aragorn search for the orc-captured Merry and Pippin. All along, nefarious wizard Saruman awaits the Fellowship members at the Orthanc Tower in Isengard.",
    rating: '8.4',
    releaseDate: new Date('2002-12-18'),
    runtime: 179,
    tagline: 'The fellowship is broken. The power of darkness grows...',
    title: 'The Lord of the Rings: The Two Towers',
    tmdbId: 121,
    tmdbPosterPath: '/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
    director: 'Peter Jackson',
    originalLanguage: 'en',
    originalTitle: 'The Lord of the Rings: The Two Towers',
  },
  {
    genres: ['Drama'],
    imdbId: 'tt0137523',
    overview:
      'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
    rating: '8.4',
    releaseDate: new Date('1999-10-15'),
    runtime: 139,
    tagline: 'Mischief. Mayhem. Soap.',
    title: 'Fight Club',
    tmdbId: 550,
    tmdbPosterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    director: 'David Fincher',
    originalLanguage: 'en',
    originalTitle: 'Fight Club',
  },
  {
    genres: ['Action', 'Science Fiction', 'Adventure'],
    imdbId: 'tt1375666',
    overview:
      'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
    rating: '8.4',
    releaseDate: new Date('2010-07-15'),
    runtime: 148,
    tagline: 'Your mind is the scene of the crime.',
    title: 'Inception',
    tmdbId: 27205,
    tmdbPosterPath: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    director: 'Christopher Nolan',
    originalLanguage: 'en',
    originalTitle: 'Inception',
  },
  {
    genres: ['Adventure', 'Action', 'Science Fiction'],
    imdbId: 'tt0080684',
    overview:
      'The epic saga continues as Luke Skywalker, in hopes of defeating the evil Galactic Empire, learns the ways of the Jedi from aging master Yoda. But Darth Vader is more determined than ever to capture Luke. Meanwhile, rebel leader Princess Leia, cocky Han Solo, Chewbacca, and droids C-3PO and R2-D2 are thrown into various stages of capture, betrayal and despair.',
    rating: '8.4',
    releaseDate: new Date('1980-05-20'),
    runtime: 124,
    tagline: 'The Star Wars saga continues.',
    title: 'The Empire Strikes Back',
    tmdbId: 1891,
    tmdbPosterPath: '/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
    director: 'Irvin Kershner',
    originalLanguage: 'en',
    originalTitle: 'The Empire Strikes Back',
  },
  {
    genres: ['Action', 'Science Fiction'],
    imdbId: 'tt0133093',
    overview:
      'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    rating: '8.2',
    releaseDate: new Date('1999-03-31'),
    runtime: 136,
    tagline: 'Believe the unbelievable.',
    title: 'The Matrix',
    tmdbId: 603,
    tmdbPosterPath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    director: 'Lana Wachowski',
    originalLanguage: 'en',
    originalTitle: 'The Matrix',
  },
  {
    genres: ['Drama', 'Crime'],
    imdbId: 'tt0099685',
    overview:
      'The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family under the guidance of Jimmy Conway.',
    rating: '8.5',
    releaseDate: new Date('1990-09-12'),
    runtime: 145,
    tagline: 'Three decades of life in the mafia.',
    title: 'GoodFellas',
    tmdbId: 769,
    tmdbPosterPath: '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    director: 'Martin Scorsese',
    originalLanguage: 'en',
    originalTitle: 'GoodFellas',
  },
  {
    genres: ['Drama'],
    imdbId: 'tt0073486',
    overview:
      'A petty criminal fakes insanity to serve his sentence in a mental ward rather than prison. He soon finds himself as a leader to the other patients—and an enemy to the cruel, domineering nurse who runs the ward.',
    rating: '8.4',
    releaseDate: new Date('1975-11-19'),
    runtime: 133,
    tagline: "If he's crazy, what does that make you?",
    title: "One Flew Over the Cuckoo's Nest",
    tmdbId: 510,
    tmdbPosterPath: '/biejlC9yx8W66KHrD5tp9YiSqmV.jpg',
    director: 'Miloš Forman',
    originalLanguage: 'en',
    originalTitle: "One Flew Over the Cuckoo's Nest",
  },
  {
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    imdbId: 'tt0816692',
    overview:
      'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    rating: '8.4',
    releaseDate: new Date('2014-11-05'),
    runtime: 169,
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    title: 'Interstellar',
    tmdbId: 157336,
    tmdbPosterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    director: 'Christopher Nolan',
    originalLanguage: 'en',
    originalTitle: 'Interstellar',
  },
  {
    genres: ['Crime', 'Mystery', 'Thriller'],
    imdbId: 'tt0114369',
    overview:
      'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the "seven deadly sins" in this dark and haunting film that takes viewers from the tortured remains of one victim to the next. The seasoned Det. Sommerset researches each sin in an effort to get inside the killer\'s mind, while his novice partner, Mills, scoffs at his efforts to unravel the case.',
    rating: '8.4',
    releaseDate: new Date('1995-09-22'),
    runtime: 127,
    tagline: 'Seven deadly sins. Seven ways to die.',
    title: 'Se7en',
    tmdbId: 807,
    tmdbPosterPath: '/6yoghtyTpznpBik8EngEmJskVUO.jpg',
    director: 'David Fincher',
    originalLanguage: 'en',
    originalTitle: 'Se7en',
  },
  {
    genres: ['Drama', 'Family', 'Fantasy'],
    imdbId: 'tt0038650',
    overview:
      "A holiday favourite for generations...  George Bailey has spent his entire life giving to the people of Bedford Falls.  All that prevents rich skinflint Mr. Potter from taking over the entire town is George's modest building and loan company.  But on Christmas Eve the business's $8,000 is lost and George's troubles begin.",
    rating: '8.3',
    releaseDate: new Date('1946-12-20'),
    runtime: 130,
    tagline: "It's a wonderful laugh! It's a wonderful love!",
    title: "It's a Wonderful Life",
    tmdbId: 1585,
    tmdbPosterPath: '/bSqt9rhDZx1Q7UZ86dBPKdNomp2.jpg',
    director: 'Frank Capra',
    originalLanguage: 'en',
    originalTitle: "It's a Wonderful Life",
  },
  {
    genres: ['Action', 'Drama'],
    imdbId: 'tt0047478',
    overview:
      "A samurai answers a village's request for protection after he falls on hard times. The town needs protection from bandits, so the samurai gathers six others to help him teach the people how to defend themselves, and the villagers provide the soldiers with food.",
    rating: '8.5',
    releaseDate: new Date('1954-04-26'),
    runtime: 207,
    tagline: 'The Mighty Warriors Who Became the Seven National Heroes of a Small Town',
    title: 'Seven Samurai',
    tmdbId: 346,
    tmdbPosterPath: '/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg',
    director: 'Akira Kurosawa',
    originalLanguage: 'ja',
    originalTitle: '七人の侍',
  },
  {
    genres: ['Crime', 'Drama', 'Thriller'],
    imdbId: 'tt0102926',
    overview:
      "Clarice Starling is a top student at the FBI's training academy.  Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, serving life behind bars for various acts of murder and cannibalism.  Crawford believes that Lecter may have insight into a case and that Starling, as an attractive young woman, may be just the bait to draw him out.",
    rating: '8.3',
    releaseDate: new Date('1991-02-14'),
    runtime: 119,
    tagline: 'To enter the mind of a killer she must challenge the mind of a madman.',
    title: 'The Silence of the Lambs',
    tmdbId: 274,
    tmdbPosterPath: '/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg',
    director: 'Jonathan Demme',
    originalLanguage: 'en',
    originalTitle: 'The Silence of the Lambs',
  },
  {
    genres: ['Drama', 'History', 'War'],
    imdbId: 'tt0120815',
    overview:
      'As U.S. troops storm the beaches of Normandy, three brothers lie dead on the battlefield, with a fourth trapped behind enemy lines. Ranger captain John Miller and seven men are tasked with penetrating German-held territory and bringing the boy home.',
    rating: '8.2',
    releaseDate: new Date('1998-07-24'),
    runtime: 169,
    tagline: 'The mission is a man.',
    title: 'Saving Private Ryan',
    tmdbId: 857,
    tmdbPosterPath: '/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg',
    director: 'Steven Spielberg',
    originalLanguage: 'en',
    originalTitle: 'Saving Private Ryan',
  },
  {
    genres: ['Drama', 'Crime'],
    imdbId: 'tt0317248',
    overview:
      "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a kingpin.",
    rating: '8.4',
    releaseDate: new Date('2002-08-30'),
    runtime: 130,
    tagline: 'If you run, the beast catches you; if you stay, the beast eats you.',
    title: 'City of God',
    tmdbId: 598,
    tmdbPosterPath: '/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg',
    director: 'Fernando Meirelles',
    originalLanguage: 'pt',
    originalTitle: 'Cidade de Deus',
  },
  {
    genres: ['Comedy', 'Drama'],
    imdbId: 'tt0118799',
    overview:
      'A touching story of an Italian book seller of Jewish ancestry who lives in his own little fairy tale. His creative and happy life would come to an abrupt halt when his entire family is deported to a concentration camp during World War II. While locked up he tries to convince his son that the whole thing is just a game.',
    rating: '8.5',
    releaseDate: new Date('1997-12-20'),
    runtime: 116,
    tagline: 'An unforgettable fable that proves love, family and imagination conquer all.',
    title: 'Life Is Beautiful',
    tmdbId: 637,
    tmdbPosterPath: '/74hLDKjD5aGYOotO6esUVaeISa2.jpg',
    director: 'Roberto Benigni',
    originalLanguage: 'it',
    originalTitle: 'La vita è bella',
  },
  {
    genres: ['Fantasy', 'Drama', 'Crime'],
    imdbId: 'tt0120689',
    overview:
      "A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments. When the cell block's head guard, Paul Edgecomb, recognizes Coffey's miraculous gift, he tries desperately to help stave off the condemned man's execution.",
    rating: '8.5',
    releaseDate: new Date('1999-12-10'),
    runtime: 189,
    tagline: "Paul Edgecomb didn't believe in miracles. Until the day he met one.",
    title: 'The Green Mile',
    tmdbId: 497,
    tmdbPosterPath: '/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg',
    director: 'Frank Darabont',
    originalLanguage: 'en',
    originalTitle: 'The Green Mile',
  },
  {
    genres: ['Action', 'Thriller', 'Science Fiction'],
    imdbId: 'tt0103064',
    overview:
      'Set ten years after the events of the original, James Cameron’s classic sci-fi action flick tells the story of a second attempt to get the rid of rebellion leader John Connor, this time targeting the boy himself. However, the rebellion has sent a reprogrammed terminator to protect Connor.',
    rating: '8.1',
    releaseDate: new Date('1991-07-03'),
    runtime: 137,
    tagline: "It's nothing personal.",
    title: 'Terminator 2: Judgment Day',
    tmdbId: 280,
    tmdbPosterPath: '/5M0j0B18abtBI5gi2RhfjjurTqb.jpg',
    director: 'James Cameron',
    originalLanguage: 'en',
    originalTitle: 'Terminator 2: Judgment Day',
  },
  {
    genres: ['Adventure', 'Action', 'Science Fiction'],
    imdbId: 'tt0076759',
    overview:
      'Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.',
    rating: '8.2',
    releaseDate: new Date('1977-05-25'),
    runtime: 121,
    tagline: 'A long time ago in a galaxy far, far away...',
    title: 'Star Wars',
    tmdbId: 11,
    tmdbPosterPath: '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    director: 'George Lucas',
    originalLanguage: 'en',
    originalTitle: 'Star Wars',
  },
  {
    genres: ['Adventure', 'Comedy', 'Science Fiction'],
    imdbId: 'tt0088763',
    overview:
      "Eighties teenager Marty McFly is accidentally sent back in time to 1955, inadvertently disrupting his parents' first meeting and attracting his mother's romantic interest. Marty must repair the damage to history by rekindling his parents' romance and - with the help of his eccentric inventor friend Doc Brown - return to 1985.",
    rating: '8.3',
    releaseDate: new Date('1985-07-03'),
    runtime: 116,
    tagline:
      "He was never in time for his classes. He wasn't in time for his dinner. Then one day...he wasn't in his time at all.",
    title: 'Back to the Future',
    tmdbId: 105,
    tmdbPosterPath: '/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
    director: 'Robert Zemeckis',
    originalLanguage: 'en',
    originalTitle: 'Back to the Future',
  },
]

const books = [
  {
    authors: ['Gabrielle Zevin'],
    description:
      "<p><b>A <i>New York Times </i>100 Best Books of the 21st Century </b><br><br><b>THE MILLION-COPY BESTSELLING PHENOMENON</b><br>‘Exhilarating, timely and emotive’ <b><i>GUARDIAN</i></b><br>'I devoured it. So enjoyable' <b>ZADIE SMITH</b><br>‘Love, friendship and betrayal...gorgeous’ <b><i>SUNDAY TELEGRAPH</i></b><br>------------------------------------<br><b>This is the story of Sam and Sadie. It's not a romance, but it is about love. </b><br>When Sam catches sight of Sadie at a crowded train station one morning he is catapulted straight back to childhood, and the hours they spent immersed in playing games.<br>Their spark is instantly reignited and sets off a creative collaboration that will make them superstars. It is the 90s, and anything is possible.<br>What comes next is a decades-long tale of friendship and rivalry, fame and art, betrayal and tragedy, perfect worlds and imperfect ones. And, above all, our need to connect: to be loved and to love.<br>---------------------------------------<br>'I'm LOVING it' <b>ZOE SUGG</b><br>'One of the best books I've ever read' <b>JOHN GREEN</b><br>‘Extraordinary... made me sob' <b>JOJO MOYES</b><br>'Magnificent... Such wisdom and tenderness' <b>RUSSELL T. DAVIES</b><br>‘I couldn’t put it down’ <b>GERI HALLIWELL</b><br>‘Beautiful and heartbreaking’ <b>THE TIMES</b><br>'An exquisite love-letter to life' <b>TAYARI JONES</b><br>'Anyone who reads <i>Tomorrow </i>can't stop talking about it' <b><i>STYLIST</i></b><br>‘I loved it’ <b>CELESTE NG</b><br>‘Exhilarating’ <b><i>PSYCHOLOGIES</i></b><br>'This BLEW me away' <b>PANDORA SYKES</b><br>'The go-to for your next hit of nineties nostalgia' <b>EVENING STANDARD</b><br>‘Terrific...Zevin is a great writer’ <b>BILL GATES</b><br>‘Tremendous... A literary blockbuster destined to be filed in the Great American Novel category’ <b><i>INDEPENDENT</i></b><br><br><br><i>Tomorrow, and Tomorrow, and Tomorrow </i>was a #1 <i>Sunday Times</i> bestseller from 30.07.2023 - 24.9.23<br><br>Note: There is a chance the book cover you receive may differ from the cover displayed here.</p>",
    genres: [
      'Fiction / Literary',
      'Fiction / Friendship',
      'Fiction / Disabilities',
      'Fiction / Coming of Age',
      'Fiction / Own Voices',
      'Fiction / World Literature / American / 21st Century',
      'Fiction / Cultural Heritage',
      'Fiction / General',
    ],
    googleId: 'dI1IEAAAQBAJ',
    pages: 496,
    publicationDate: new Date('2022-07-14'),
    subtitle: 'Treat yourself to the #1 Sunday Times bestselling holiday read this summer',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
  },
  {
    authors: ['Jodi Picoult'],
    description:
      '<b><b>#1 <i>NEW YORK TIMES </i>BESTSELLER • From the author of <i>Small Great Things</i> and <i>The Book of Two Ways</i> comes “a powerfully evocative story of resilience and the triumph of the human spirit” (Taylor Jenkins Reid, author of <i>The Seven Husbands of Evelyn Hugo</i> and <i>Daisy Jones & The Six</i>)<br><br>Look for Jodi Picoult’s new novel, <i>By Any Other Name, </i>available August 20!</b></b><br><br>Diana O’Toole is perfectly on track. She will be married by thirty, done having kids by thirty-five, and move out to the New York City suburbs, all while climbing the professional ladder in the cutthroat art auction world. She’s an associate specialist at Sotheby’s now, but her boss has hinted at a promotion if she can close a deal with a high-profile client. She’s not engaged just yet, but she knows her boyfriend, Finn, a surgical resident, is about to propose on their romantic getaway to the Galápagos—days before her thirtieth birthday. Right on time.<br><br>But then a virus that felt worlds away has appeared in the city, and on the eve of their departure, Finn breaks the news: It’s all hands on deck at the hospital. He has to stay behind. <i>You should still go,</i> he assures her, since it would be a shame for all of their nonrefundable trip to go to waste. And so, reluctantly, she goes.<br><br>Almost immediately, Diana’s dream vacation goes awry. Her luggage is lost, the Wi-Fi is nearly nonexistent, and the hotel they’d booked is shut down due to the pandemic. In fact, the whole island is now under quarantine, and she is stranded until the borders reopen. Completely isolated, she must venture beyond her comfort zone. Slowly, she carves out a connection with a local family when a teenager with a secret opens up to Diana, despite her father’s suspicion of outsiders.<br><br>In the Galápagos Islands, where Darwin’s theory of evolution by natural selection was formed, Diana finds herself examining her relationships, her choices, and herself—and wondering if when she goes home, she too will have evolved into someone completely different.',
    genres: ['Fiction / Women', 'Fiction / Literary', 'Fiction / Sagas'],
    googleId: 'e1IoEAAAQBAJ',
    pages: 400,
    publicationDate: new Date('2021-11-30'),
    subtitle: 'A Novel',
    title: 'Wish You Were Here',
  },
  {
    authors: ['Fredrik Backman'],
    description:
      '<b>A breathtaking new novel from the #1 <i>New York Times</i> bestselling author of <i>Anxious People</i> and <i>A Man Called Ove</i>, <i>The Winners</i> returns to the close-knit, resilient community of Beartown for a story about first loves, second chances, and last goodbyes.</b><br><br>Over the course of two weeks, everything in Beartown will change. <br> <br>Maya Andersson and Benji Ovich, two young people who left in search of a life far from the forest town, come home and joyfully reunite with their closest childhood friends. There is a new sense of optimism and purpose in the town, embodied in the impressive new ice rink that has been built down by the lake.<br> <br>Two years have passed since the events that no one wants to think about. Everyone has tried to move on, but there’s something about this place that prevents it. The destruction caused by a ferocious late-summer storm reignites the old rivalry between Beartown and the neighboring town of Hed, a rivalry which has always been fought through their ice hockey teams.<br> <br>Maya’s parents, Peter and Kira, are caught up in an investigation of the hockey club’s murky finances, and Amat—once the star of the Beartown team—has lost his way after an injury and a failed attempt to get drafted into the NHL. Simmering tensions between the two towns turn into acts of intimidation and then violence. All the while, a fourteen-year-old boy grows increasingly alienated from this hockey-obsessed community and is determined to take revenge on the people he holds responsible for his beloved sister’s death. He has a pistol and a plan that will leave Beartown with a loss that is almost more that it can stand.<br> <br>As it beautifully captures all the complexities of daily life and explores questions of friendship, loyalty, loss, and identity, this emotion-packed novel asks us to reconsider what it means to win, what it means to lose, and what it means to forgive.',
    genres: ['Fiction / Literary', 'Fiction / Sports', 'Fiction / Small Town & Rural'],
    googleId: '_zVbEAAAQBAJ',
    pages: 688,
    publicationDate: new Date('2022-09-27'),
    subtitle: 'A Novel',
    title: 'The Winners',
  },
  {
    authors: ['Shelby Van Pelt'],
    description:
      "<p>AN INSTANT NEW YORK TIMES BESTSELLER</p><p>A Read With Jenna Today Show Book Club Pick!</p><p>NAMED A BEST BOOK OF SUMMER by: Chicago Tribune * The View * Southern Living * USA Today</p><p>\"Remarkably Bright Creatures [is] an ultimately feel-good but deceptively sensitive debut. . . . Memorable and tender.\" -- Washington Post </p><p>For fans of A Man Called Ove, a charming, witty and compulsively readable exploration of friendship, reckoning, and hope that traces a widow's unlikely connection with a giant Pacific octopus</p><p>After Tova Sullivan's husband died, she began working the night shift at the Sowell Bay Aquarium, mopping floors and tidying up. Keeping busy has always helped her cope, which she's been doing since her eighteen-year-old son, Erik, mysteriously vanished on a boat in Puget Sound over thirty years ago.</p><p>Tova becomes acquainted with curmudgeonly Marcellus, a giant Pacific octopus living at the aquarium. Marcellus knows more than anyone can imagine but wouldn't dream of lifting one of his eight arms for his human captors--until he forms a remarkable friendship with Tova.</p><p>Ever the detective, Marcellus deduces what happened the night Tova's son disappeared. And now Marcellus must use every trick his old invertebrate body can muster to unearth the truth for her before it's too late. </p><p>Shelby Van Pelt's debut novel is a gentle reminder that sometimes taking a hard look at the past can help uncover a future that once felt impossible.</p>",
    genres: [
      'Fiction / Humorous / General',
      'Fiction / Literary',
      'Fiction / Mystery & Detective / Cozy / Animals',
      'Fiction / Family Life / General',
      'Fiction / Animals',
    ],
    googleId: 'rKqWzgEACAAJ',
    pages: 360,
    publicationDate: new Date('2022-01-01'),
    subtitle: 'A Novel',
    title: 'Remarkably Bright Creatures',
  },
  {
    authors: ['Elin Hilderbrand'],
    description:
      "<p><b>*#1 NEW YORK TIMES BESTSELLER* </b><br><b>*#1 USA TODAY BESTSELLER*</b><br><b><br>Escape to Hotel Nantucket for a summer of sunshine, secrets and scandal... The ultimate summer page-turner from the internationally bestselling Queen of Beach Reads</b><br><br>Reeling from a bad break-up, Lizbet Keaton is desperately seeking a fresh start. When she's named the new general manager of the Hotel Nantucket, a Gilded Age gem whose glamour has been left to tarnish, she hopes that her local expertise and charismatic staff can transform the hotel's fortunes - and her own.<br><br>All she needs to do is win over their new billionaire owner from London, Xavier Darling - and the wildly popular Instagram influencer, Shelly Carpenter, who can help put them back on the map. But behind the glossy façade, complete with wellness centre and celebrity chef-run restaurant, a perfect storm is brewing.<br><br>Hotel Nantucket can't seem to shake off the scandal of 1922, when a tragic fire killed nineteen-year-old chambermaid Grace Hadley - and the guests have complicated pasts of their own. With Grace gleefully haunting the halls, secrets among the staff, and Lizbet's own romantic uncertainty, there's going to be trouble in paradise. . .<br><br><b>Deliciously escapist, full of emotion, and with a dash of Roaring Twenties glamour, this is the perfect read from the bestselling 'Queen of the Summer Novel' (<i>People</i>) </b><br><br><b>'I just LOVE her books, they are such compulsive reads' MARIAN KEYES</b><br><br><b>***</b><br><br><b>Readers love Elin Hilderbrand's emotional, escapist novels!</b><br><br>'Seductively beautiful - the perfect escapist read'<br><br>'Perfect summer reading. The setting is as wonderful as the characters . . . I loved every minute'<br><br>'Ever since I discovered Elin's books, her novels have become my summer holiday treat'<br><br>'Captivating from beginning to end' <br><br>'Funny, sad, emotional and utterly absorbing, I couldn't put it down'</p>",
    genres: [
      'Fiction / Holidays',
      'Fiction / Romance / Contemporary',
      'Fiction / Romance / Holiday',
      'Fiction / Women',
      'Fiction / Family Life / General',
      'Fiction / General',
    ],
    googleId: 'qstmEAAAQBAJ',
    pages: 416,
    publicationDate: new Date('2022-06-14'),
    subtitle:
      'The perfect escapist summer read from the #1 bestseller and author of THE PERFECT COUPLE, now a major Netflix series',
    title: 'The Hotel Nantucket',
  },
  {
    authors: ['Celeste Ng'],
    description:
      '<b>An instant <i>New York Times </i>bestseller • A <i>New York Times </i>Notable Book • Named a Best Book of 2022 by <i>People, </i>TIME Magazine, <i>The Washington Post, USA Today</i>, NPR, <i>Los Angeles Times</i>, and <i>Oprah Daily, </i>and more • A Reese\'s Book Club Pick • <i>New York Times </i>Paperback Row Selection<br><br>From the #1 bestselling author of <i>Little Fires Everywhere</i>, comes the inspiring new novel about a mother’s unshakeable love.<br> <br>“Riveting, tender, and timely.” —<i>People, </i>Book of the Week<br><br>"Remarkable . . . An unflinching yet life-affirming drama about the power of art and love to push back in dangerous times." —<i>Oprah Daily</i><br><br>“Thought-provoking, heart-wrenching . . . I was so invested in the future of this mother and son.” —Reese Witherspoon (Reese’s Book Club Pick)</b><br> <br> Twelve-year-old Bird Gardner lives a quiet existence with his loving father, a former linguist who now shelves books in a university library. His mother, Margaret, a Chinese American poet, left without a trace when he was nine years old. He doesn’t know what happened to her—only that her books have been banned—and he resents that she cared more about her work than about him.<br>  <br> Then one day Bird receives a mysterious letter containing only a cryptic drawing, and soon he is pulled into a quest to find her. His journey will take him back to the many folktales she poured into his head as a child, through the ranks of an underground network of heroic librarians, and finally to New York City, where he will learn the truth about what happened to his mother and what the future holds for them both.<br>  <br> <i>Our Missing Hearts</i> is an old story made new, of the ways supposedly civilized communities can ignore the most searing injustice. It’s about the lessons and legacies we pass on to our children and the power of art to create change.',
    genres: ['Fiction / Literary', 'Fiction / Family Life / General', 'Fiction / Asian American'],
    googleId: 'fdlYEAAAQBAJ',
    pages: 352,
    publicationDate: new Date('2022-10-04'),
    subtitle: "Reese's Book Club (A Novel)",
    title: 'Our Missing Hearts',
  },
  {
    authors: ['Coco Mellors'],
    description:
      "<p>BLUE SISTERS, THE HOTLY ANTICIPATED NEW NOVEL FROM COCO MELLORS, IS OUT NOW.</p><p>‘A tender, devastating and funny exploration of love and friendship and the yearning for self-evisceration. Coco Mellors is an elegant and exciting new voice’ PANDORA SYKES, author of How Do We Know We’re Doing It Right</p><p>New York is slipping from Cleo’s grasp. Sure, she’s at a different party every other night, but she barely knows anyone. Her student visa is running out, and she doesn’t even have money for cigarettes. But then she meets Frank. Twenty years older, Frank's life is full of all the success and excess that Cleo's lacks. He offers her the chance to be happy, the freedom to paint, and the opportunity to apply for a green card. She offers him a life imbued with beauty and art—and, hopefully, a reason to cut back on his drinking. He is everything she needs right now.</p><p>Cleo and Frank run head-first into a romance that neither of them can quite keep up with. It reshapes their lives and the lives of those around them, whether that’s Cleo's best friend struggling to embrace his gender identity in the wake of her marriage, or Frank's financially dependent sister arranging sugar daddy dates after being cut off. Ultimately, this chance meeting between two strangers outside of a New Year’s Eve party changes everything, for better or worse.</p><p>Cleopatra and Frankenstein is an astounding and painfully relatable debut novel about the spontaneous decisions that shape our entire lives and those imperfect relationships born of unexpectedly perfect evenings.</p>",
    genres: [
      'Fiction / Literary',
      'Fiction / City Life',
      'Fiction / Women',
      'Fiction / Family Life / Marriage & Divorce',
      'Fiction / General',
      'Psychology / Emotions',
      'Psychology / Human Sexuality',
      'Fiction / Romance / Contemporary',
    ],
    googleId: 'Y6c4EAAAQBAJ',
    pages: 384,
    publicationDate: new Date('2022-02-08'),
    subtitle: null,
    title: 'Cleopatra and Frankenstein',
  },
  {
    authors: ['Hanya Yanagihara'],
    description:
      '<b>#1 <i>NEW YORK TIMES</i> BEST SELLER • From the award-winning, best-selling author of the classic <i>A Little Life—</i>a bold, brilliant novel spanning three centuries and three different versions of the American experiment, about lovers, family, loss and the elusive promise of utopia.</b><br><br><b>A BEST BOOK OF THE YEAR:<i> VOGUE </i>• <i>ESQUIRE </i>• <i>NPR </i>• GOODREADS<br></b><br><i>To Paradise</i> is a <i>fin de</i> siècle novel of marvelous literary effect, but above all it is a work of emotional genius. The great power of this remarkable novel is driven by Yanagihara’s understanding of the aching desire to protect those we love—partners, lovers, children, friends, family, and even our fellow citizens—and the pain that ensues when we cannot.<br><br>In an alternate version of 1893 America, New York is part of the Free States, where people may live and love whomever they please (or so it seems). The fragile young scion of a distinguished family resists betrothal to a worthy suitor, drawn to a charming music teacher of no means. In a 1993 Manhattan besieged by the AIDS epidemic, a young Hawaiian man lives with his much older, wealthier partner, hiding his troubled childhood and the fate of his father. And in 2093, in a world riven by plagues and governed by totalitarian rule, a powerful scientist’s damaged granddaughter tries to navigate life without him—and solve the mystery of her husband’s disappearances.<br> <br>These three sections comprise an ingenious symphony, as recurring notes and themes deepen and enrich one another: A townhouse in Washington Square Park in Greenwich Village; illness, and treatments that come at a terrible cost; wealth and squalor; the weak and the strong; race; the definition of family, and of nationhood; the dangerous righteousness of the powerful, and of revolutionaries; the longing to find a place in an earthly paradise, and the gradual realization that it can’t exist. What unites not just the characters, but these Americas, are their reckonings with the qualities that make us human: Fear. Love. Shame. Need. Loneliness.',
    genres: ['Fiction / Literary', 'Fiction / Historical / General', 'Fiction / Dystopian'],
    googleId: 'WN4nEAAAQBAJ',
    pages: 720,
    publicationDate: new Date('2022-01-11'),
    subtitle: 'A Novel',
    title: 'To Paradise',
  },
  {
    authors: ['Emily St. John Mandel'],
    description:
      '<b><i>NEW YORK TIMES</i> BESTSELLER • The award-winning, best-selling author of <i>Station Eleven</i> and <i>The Glass Hotel</i> returns with a novel of art, time travel, love, and plague that takes the reader from Vancouver Island in 1912 to a dark colony on the moon five hundred years later, unfurling a story of humanity across centuries and space.<br><br>One of the Best Books of the Year: <i>The New York Times</i>, NPR, GoodReads <br><br>“One of [Mandel’s] finest novels and one of her most satisfying forays into the arena of speculative fiction yet.” —<i>The New York Times</i></b><br><br>Edwin St. Andrew is eighteen years old when he crosses the Atlantic by steamship, exiled from polite society following an ill-conceived diatribe at a dinner party. He enters the forest, spellbound by the beauty of the Canadian wilderness, and suddenly hears the notes of a violin echoing in an airship terminal—an experience that shocks him to his core. <br><br>Two centuries later a famous writer named Olive Llewellyn is on a book tour. She’s traveling all over Earth, but her home is the second moon colony, a place of white stone, spired towers, and artificial beauty. Within the text of Olive’s best-selling pandemic novel lies a strange passage: a man plays his violin for change in the echoing corridor of an airship terminal as the trees of a forest rise around him. <br><br>When Gaspery-Jacques Roberts, a detective in the black-skied Night City, is hired to investigate an anomaly in the North American wilderness, he uncovers a series of lives upended: The exiled son of an earl driven to madness, a writer trapped far from home as a pandemic ravages Earth, and a childhood friend from the Night City who, like Gaspery himself, has glimpsed the chance to do something extraordinary that will disrupt the timeline of the universe.<br><br>A virtuoso performance that is as human and tender as it is intellectually playful, <i>Sea of Tranquility</i> is a novel of time travel and metaphysics that precisely captures the reality of our current moment.',
    genres: [
      'Fiction / Literary',
      'Fiction / Science Fiction / Apocalyptic & Post-Apocalyptic',
      'Fiction / Science Fiction / Time Travel',
    ],
    googleId: 'fj84EAAAQBAJ',
    pages: 272,
    publicationDate: new Date('2022-04-05'),
    subtitle: 'A novel',
    title: 'Sea of Tranquility',
  },
  {
    authors: ['Silvia Moreno-Garcia'],
    description:
      '<b><i>NEW YORK TIMES </i>BESTSELLER • From the bestselling author of <i>Mexican Gothic</i> and <i>Velvet Was the Night</i> comes a lavish historical drama reimagining of <i>The Island of Doctor Moreau </i>set against the backdrop of nineteenth-century Mexico.<br><br>“This is historical science fiction at its best: a dreamy reimagining of a classic story with vivid descriptions of lush jungles and feminist themes. Some light romance threads through the heavier ethical questions concerning humanity.”—<i>Library Journal</i> (starred review)<br><br>“The imagination of Silvia Moreno-Garcia is a thing of wonder, restless and romantic, fearless in the face of genre, embracing the polarities of storytelling—the sleek and the bizarre, wild passions and deep hatreds—with cool equanimity.”—<i>The New York Times </i>(Editors<b>’</b> Choice)</b><br><b><br>FINALIST FOR THE HUGO AWARD • ONE OF THE BEST BOOKS OF THE YEAR: <i>The New York Times Book Review, Time, </i>NPR, <i>Polygon, Tordotcom, Paste, CrimeReads, Booklist</i></b><br><br>Carlota Moreau: A young woman growing up on a distant and luxuriant estate, safe from the conflict and strife of the Yucatán peninsula. The only daughter of a researcher who is either a genius or a madman.<br><br>Montgomery Laughton: A melancholic overseer with a tragic past and a propensity for alcohol. An outcast who assists Dr. Moreau with his experiments, which are financed by the Lizaldes, owners of magnificent haciendas and plentiful coffers.<br><br>The hybrids: The fruits of the doctor’s labor, destined to blindly obey their creator and remain in the shadows. A motley group of part human, part animal monstrosities.<br><br>All of them live in a perfectly balanced and static world, which is jolted by the abrupt arrival of Eduardo Lizalde, the charming and careless son of Dr. Moreau’s patron, who will unwittingly begin a dangerous chain reaction.<br><br>For Moreau keeps secrets, Carlota has questions, and, in the sweltering heat of the jungle, passions may ignite.<br><i><br>The Daughter of Doctor Moreau</i> is both a dazzling historical novel and a daring science fiction journey.',
    genres: [
      'Fiction / Historical / General',
      'Fiction / Science Fiction / Genetic Engineering',
      'Fiction / Hispanic & Latino',
    ],
    googleId: '0z9JEAAAQBAJ',
    pages: 352,
    publicationDate: new Date('2022-07-19'),
    subtitle: null,
    title: 'The Daughter of Doctor Moreau',
  },
  {
    authors: ['Tamsyn Muir'],
    description:
      "<p><b>Tamsyn Muir's <i>New York Times</i> and <i>USA Today</i> bestselling Locked Tomb Series continues with <i>Nona ...the Ninth</i>?</b><br><br><b>A Finalist for the Hugo and Locus Awards!</b><br><br><b>An </b><b>Indie Next Pick!</b><br><b><br>The Locked Tomb is a 2023 Hugo Finalist for Best Series!</b><br><b><br>“You will love Nona, and Nona loves you.” —Alix E. Harrow</b><br><b><br>“Unlike anything I've ever read.” —V.E. Schwab on <i>Gideon the Ninth</i></b><br><b><br>“Deft, tense and atmospheric, compellingly immersive and wildly original.” —<i>The New York Times</i> on <i>Gideon the Ninth</i></b><br><br>Her city is under siege.<br><br>The zombies are coming back.<br><br>And all Nona wants is a birthday party.<br><br>In many ways, Nona is like other people. She lives with her family, has a job at her local school, and loves walks on the beach and meeting new dogs. But Nona's not like other people. Six months ago she woke up in a stranger's body, and she's afraid she might have to give it back.<br><br>The whole city is falling to pieces. A monstrous blue sphere hangs on the horizon, ready to tear the planet apart. Blood of Eden forces have surrounded the last Cohort facility and wait for the Emperor Undying to come calling. Their leaders want Nona to be the weapon that will save them from the Nine Houses. Nona would prefer to live an ordinary life with the people she loves, with Pyrrha and Camilla and Palamedes, but she also knows that nothing lasts forever.<br><br>And each night, Nona dreams of a woman with a skull-painted face... <br><br><br>At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.</p>",
    genres: ['Fiction / Science Fiction / Space Opera', 'Fiction / Fantasy / Epic'],
    googleId: 'oIxCEAAAQBAJ',
    pages: 496,
    publicationDate: new Date('2022-09-13'),
    subtitle: null,
    title: 'Nona the Ninth',
  },
  {
    authors: ['Sequoia Nagamatsu'],
    description:
      "<b>SHORTLISTED FOR THE WATERSTONES DEBUT FICTION PRIZE 2022</b><br><b>FINALIST FOR THE BARNES & NOBLE DISCOVER PRIZE 2022<br>FINALIST FOR THE URSULA LE GUIN PRIZE FOR FICTION 2022</b><br><b>WATERSTONES AND ESQUIRE BEST BOOKS OF 2022</b><br><b><b><br></b>For fans of <i>Cloud Atlas</i> and <i>Station Eleven</i>, Sequoia Nagamatsu's debut is a wildly imaginative, genre-bending work spanning generations across the globe as humanity struggles to rebuild itself in the aftermath of a climate plague.</b><br><b><br></b><b>'Haunting and luminous ... An astonishing debut'</b> – Alan Moore, creator of <i>Watchmen</i> and <i>V for Vendetta</i><br><br><b>'A powerfully moving and thought provoking read. At times sublime, strange and deeply human' </b>Adrian Tchaikovsky, bestselling author of the <i>Children of Time</i> series<br><br>Dr. Cliff Miyashiro arrives in the Arctic Circle to continue his recently deceased daughter's research, only to discover a virus, newly unearthed from melting permafrost. The plague unleashed reshapes life on earth for generations. Yet even while struggling to counter this destructive force, humanity stubbornly persists in myriad moving and ever inventive ways.<br><br>Among those adjusting to this new normal are an aspiring comedian, employed by a theme park designed for terminally ill children, who falls in love with a mother trying desperately to keep her son alive; a scientist who, having failed to save his own son from the plague, gets a second chance at fatherhood when one of his test subjects-a pig-develops human speech; a man who, after recovering from his own coma, plans a block party for his neighbours who have also woken up to find that they alone have survived their families; and a widowed painter and her teenaged granddaughter who must set off on cosmic quest to locate a new home planet.<br><br>From funerary skyscrapers to hotels for the dead, <i>How High We Go in the Dark</i> follows a cast of intricately linked characters spanning hundreds of years as humanity endeavours to restore the delicate balance of the world. This is a story of unshakable hope that crosses literary lines to give us a world rebuilding itself through an endless capacity for love, resilience and reinvention.<br><br><b>Wonderful and disquieting, dreamlike and all too possible. [<i>How High We Go in the Dark</i>] reaches far beyond our stars while its heart remains rooted to Earth, and reminds us that our wellbeing depends on the wellbeing of our world</b> - Samantha Shannon, author of <i>The Priory of the Orange Tree </i>",
    genres: [
      'Fiction / Dystopian',
      'Fiction / Literary',
      'Fiction / Science Fiction / Apocalyptic & Post-Apocalyptic',
      'Fiction / Disaster',
      'Fiction / General',
      'Fiction / Science Fiction / General',
      'Science / Global Warming & Climate Change',
      'Social Science / Disasters & Disaster Relief',
    ],
    googleId: 'd3g4EAAAQBAJ',
    pages: 304,
    publicationDate: new Date('2022-01-18'),
    subtitle: null,
    title: 'How High We Go in the Dark',
  },
]

export default async () => {
  try {
    await db.movie.createMany({ data: movies })
    await db.book.createMany({ data: books })

    const users = [
      {
        username: 'test',
        password: 'test1234',
        movieLists: {
          create: [
            { name: DefaultMovieLists.Watchlist, movies: { create: range(21, 30).map((n) => ({ movieId: n })) } },
            { name: DefaultMovieLists.Watched, movies: { create: range(1, 20).map((n) => ({ movieId: n })) } },
          ],
        },
        bookLists: {
          create: [
            { name: DefaultBookLists.ReadingList, books: { create: range(9, 12).map((n) => ({ bookId: n })) } },
            { name: DefaultBookLists.Read, books: { create: range(1, 8).map((n) => ({ bookId: n })) } },
          ],
        },
        metrics: {
          create: [
            {
              name: 'Weight',
              unit: 'Kg',
              entries: {
                create: range(1, 8).map((n) => ({ value: `${90 - n}`, date: new Date(`2023-0${n + 1}-01`) })),
              },
            },
            {
              name: 'Savings',
              unit: '$',
              entries: {
                create: range(1, 8).map((n) => ({ value: `${1000 * n}`, date: new Date(`2023-0${n + 1}-01`) })),
              },
            },
            {
              name: 'Daily Steps',
              unit: 'Steps',
              entries: {
                create: range(1, 8).map((n) => ({ value: `${2000 * n}`, date: new Date(`2023-0${n + 1}-01`) })),
              },
            },
          ],
        },
        documents: {
          create: [
            {
              title: 'Ice cream',
              body: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"It’s all about ice cream","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h1"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"You can\'t buy happiness, but you can buy ice cream, and that\'s pretty close.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Ice cream is a ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"#delightful","type":"hashtag","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" treat that transcends ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"age","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":", ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"culture","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":", and ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"season","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":". Regardless of whether it’s a sweltering summer day or a cosy winter evening, ice cream has a unique knack for elevating our mood and bringing smiles to our faces. Its creamy texture, rich flavours, and the refreshing chill it offers make it a universally loved dessert. Few foods are as versatile as ice cream; it can be served in a cone, a bowl, or as part of a decadent sundae, allowing for endless customisation to cater to individual tastes and preferences.","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"One of the most compelling reasons why ice cream is hailed as the best food ever is its vast array of ","type":"text","version":1},{"detail":0,"format":10,"mode":"normal","style":"","text":"flavours","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":".","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"vanilla","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"chocolate","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":4,"mode":"normal","style":"","text":"strawberry","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"There’s an ice cream flavour for everyone. Each flavour has the potential to evoke memories and sensations, whether it’s the nostalgic taste of childhood mint chocolate chip scoops on a hot day or the sophisticated profile of a bourbon-infused caramel swirl enjoyed after dinner. This rich spectrum of flavours ensures that ice cream never gets boring; there’s always something new to try or an old favourite to revisit.","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Beyond its ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"#delightful","type":"hashtag","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" taste and variety, ice cream also holds a special significance in many cultural and social contexts.","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"birthday parties","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"weddings","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"family gatherings","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ol"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sharing a cone with a friend or indulging in a sundae at the local ice cream parlour fosters connection and creates lasting memories. These communal experiences further solidify ice cream\'s status as a beloved food, one that brings people together in laughter and happiness.","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Moreover, the act of enjoying ice cream itself can be a soothing ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"ritual","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":". There’s something inherently therapeutic in savouring each spoonful, allowing thoughts to drift as the creamy goodness melts blissfully in your mouth. This sensory experience is heightened by the way ice cream engages all the senses—its vibrant colours, enticing aromas, and ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"#delightful","type":"hashtag","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" textures. It can be a source of comfort during tough times or a celebratory treat during moments of joy, making it a unique comfort food that caters to our emotional needs.","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The best ice cream places in Bologna to try:","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cremeria Santo Stefano","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://maps.app.goo.gl/3sf1kHA1J13ZgzK18"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cremeria da Paolo","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://maps.app.goo.gl/pi2txfNnLeXusX5o9"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":2},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cremeria Mascarella","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://maps.app.goo.gl/UKjNfra1dc4LurKF9"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"},{"type":"horizontalrule","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"In sum, ice cream is not merely a food choice; it embodies joy, community, and creativity, making it a timeless favourite for many. Its ability to evoke positive emotions and create lasting memories is what truly sets it apart as the best food ever.","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"const","type":"code-highlight","version":1,"highlightType":"keyword"},{"detail":0,"format":0,"mode":"normal","style":"","text":" flavours ","type":"code-highlight","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"=","type":"code-highlight","version":1,"highlightType":"operator"},{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"code-highlight","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"[","type":"code-highlight","version":1,"highlightType":"punctuation"},{"detail":0,"format":0,"mode":"normal","style":"","text":"\\"pistacchio\\"","type":"code-highlight","version":1,"highlightType":"string"},{"detail":0,"format":0,"mode":"normal","style":"","text":",","type":"code-highlight","version":1,"highlightType":"punctuation"},{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"code-highlight","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"\\"zabaione\\"","type":"code-highlight","version":1,"highlightType":"string"},{"detail":0,"format":0,"mode":"normal","style":"","text":"]","type":"code-highlight","version":1,"highlightType":"punctuation"},{"detail":0,"format":0,"mode":"normal","style":"","text":";","type":"code-highlight","version":1,"highlightType":"punctuation"},{"type":"linebreak","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"const","type":"code-highlight","version":1,"highlightType":"keyword"},{"detail":0,"format":0,"mode":"normal","style":"","text":" price ","type":"code-highlight","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"=","type":"code-highlight","version":1,"highlightType":"operator"},{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"code-highlight","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"3","type":"code-highlight","version":1,"highlightType":"number"},{"detail":0,"format":0,"mode":"normal","style":"","text":";","type":"code-highlight","version":1,"highlightType":"punctuation"}],"direction":"ltr","format":"","indent":0,"type":"code","version":1,"language":"javascript"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
            },
          ],
        },
        workouts: {
          create: [
            {
              name: 'Upper Body',
              date: new Date('2023-10-01'),
              startTime: '2023-10-01T14:00:00Z',
              endTime: '2023-10-01T14:30:30Z',
              durationInSeconds: 1830,
            },
            {
              name: 'Legs',
              date: new Date('2023-09-01'),
              startTime: '2023-09-01T14:00:00Z',
              endTime: '2023-09-01T14:45:00Z',
              durationInSeconds: 2700,
            },
            {
              name: 'Back',
              date: new Date('2023-08-15'),
              startTime: '2023-08-15T14:00:00Z',
              endTime: '2023-08-15T14:30:30Z',
              durationInSeconds: 1830,
            },
            {
              name: 'Full Body',
              date: new Date('2023-08-01'),
              startTime: '2023-08-01T14:00:00Z',
              endTime: '2023-08-01T15:00:15Z',
              durationInSeconds: 3615,
            },
          ],
        },
      },
      {
        username: 'john',
        password: 'john1234',
        movieLists: { create: [{ name: DefaultMovieLists.Watchlist }, { name: DefaultMovieLists.Watched }] },
        bookLists: { create: [{ name: DefaultBookLists.ReadingList }, { name: DefaultBookLists.Read }] },
      },
      {
        username: 'jane',
        password: 'jane1234',
        movieLists: { create: [{ name: DefaultMovieLists.Watchlist }, { name: DefaultMovieLists.Watched }] },
        bookLists: { create: [{ name: DefaultBookLists.ReadingList }, { name: DefaultBookLists.Read }] },
      },
    ]

    for (const { password, ...user } of users) {
      const [hashedPassword, salt] = hashPassword(password)

      await db.user.create({ data: { ...user, hashedPassword, salt } })
    }

    const bucketExists = await minioClient.bucketExists(process.env.MINIO_BUCKET_NAME)
    if (!bucketExists) {
      await minioClient.makeBucket(process.env.MINIO_BUCKET_NAME)
      await minioClient.setBucketPolicy(
        process.env.MINIO_BUCKET_NAME,
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Action: 's3:GetObject',
              Effect: 'Allow',
              Principal: '*',
              Resource: `arn:aws:s3:::${process.env.MINIO_BUCKET_NAME}/*`,
              Sid: '',
            },
          ],
        })
      )
    }

    await processExercises({ args: { max: 10 } })
  } catch (error) {
    console.error(error)
  }
}
