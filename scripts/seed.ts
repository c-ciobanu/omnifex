import { BookListType, MovieListType } from '@prisma/client'
import { db } from 'api/src/lib/db'
import { minioClient } from 'api/src/lib/minio'
import { createClient } from 'redis'

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
]

const shows = [
  {
    creators: ['Craig Mazin'],
    genres: ['Drama'],
    imdbId: 'tt7366338',
    originalLanguage: 'en',
    originalTitle: 'Chernobyl',
    overview:
      'The true story of one of the worst man-made catastrophes in history: the catastrophic nuclear accident at Chernobyl. A tale of the brave men and women who sacrificed to save Europe from unimaginable disaster.',
    rating: '8.7',
    tagline: 'What is the cost of lies?',
    title: 'Chernobyl',
    tmdbBackdropPath: '/20eIP9o5ebArmu2HxJutaBjhLf4.jpg',
    tmdbId: 87108,
    tmdbPosterPath: '/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
  },
  {
    creators: ['Richard Gadd'],
    genres: ['Drama'],
    imdbId: 'tt13649112',
    originalLanguage: 'en',
    originalTitle: 'Baby Reindeer',
    overview:
      'When a struggling comedian shows one act of kindness to a vulnerable woman, it sparks a suffocating obsession which threatens to wreck both their lives.',
    rating: '7.6',
    tagline: null,
    title: 'Baby Reindeer',
    tmdbBackdropPath: '/2qLYxCyxf4fim0X5OqM5FjZqWXu.jpg',
    tmdbId: 241259,
    tmdbPosterPath: '/tN9OcbkAOPwHSr1sgMornZtQZBx.jpg',
  },
  {
    creators: [],
    genres: ['Drama', 'War & Politics'],
    imdbId: 'tt0185906',
    originalLanguage: 'en',
    originalTitle: 'Band of Brothers',
    overview:
      "Drawn from interviews with survivors of Easy Company, as well as their journals and letters, Band of Brothers chronicles the experiences of these men from paratrooper training in Georgia through the end of the war. As an elite rifle company parachuting into Normandy early on D-Day morning, participants in the Battle of the Bulge, and witness to the horrors of war, the men of Easy knew extraordinary bravery and extraordinary fear - and became the stuff of legend. Based on Stephen E. Ambrose's acclaimed book of the same name.",
    rating: '8.6',
    tagline: 'There was a time when the world asked ordinary men to do extraordinary things.',
    title: 'Band of Brothers',
    tmdbBackdropPath: '/2yDV0xLyqW88dn5qE7YCRnoYmfy.jpg',
    tmdbId: 4613,
    tmdbPosterPath: '/8JMXquNmdMUy2n2RgW8gfOM0O3l.jpg',
  },
  {
    creators: ['Danny Strong'],
    genres: ['Crime', 'Drama'],
    imdbId: 'tt9174558',
    originalLanguage: 'en',
    originalTitle: 'Dopesick',
    overview:
      'The story of how one company triggered the worst drug epidemic in American history. Look into the epicenter of America\'s struggle with opioid addiction, from a distressed Virginia mining community, to the hallways of the DEA, and to the opulence of "one percenter" Big Pharma Manhattan.',
    rating: '8.0',
    tagline: 'The true story of how America got hooked on a lie.',
    title: 'Dopesick',
    tmdbBackdropPath: '/uJxG5mIb6gUuFt9OGUUCVikserY.jpg',
    tmdbId: 110695,
    tmdbPosterPath: '/qW8Gpddy29faTcD7VuyKjwLXbKU.jpg',
  },
]

const seasons = [
  {
    showId: 1,
    airDate: new Date('2019-05-06'),
    number: 1,
    overview: '',
    rating: '9.0',
    tmdbPosterPath: '/aV0PbVnDPsfy5HFZqjiZfNNgcTU.jpg',
  },
  {
    showId: 2,
    airDate: new Date('2024-04-11'),
    number: 1,
    overview: '',
    rating: '7.8',
    tmdbPosterPath: '/jNaaG6MbOqd8ma6WnCQ6ZafE09x.jpg',
  },
  {
    showId: 3,
    airDate: new Date('2001-09-09'),
    number: 1,
    overview: '',
    rating: '8.4',
    tmdbPosterPath: '/1dTx3cRcSpaOCe0mXOVEBjz25z3.jpg',
  },
  {
    showId: 4,
    airDate: new Date('2021-10-13'),
    number: 1,
    overview: '',
    rating: '8.2',
    tmdbPosterPath: '/qW8Gpddy29faTcD7VuyKjwLXbKU.jpg',
  },
]

const episodes = [
  {
    airDate: new Date('2019-05-06'),
    number: 1,
    overview:
      'April 26, 1986, Ukrainian SSR. Plant workers and firefighters put their lives on the line to control a catastrophic 1986 explosion at a Soviet nuclear power plant.',
    rating: '8.8',
    runtime: 61,
    title: '1:23:45',
    tmdbStillPath: '/thaMHLz5l6TVL8R4EzaBkjn2EZA.jpg',
    seasonId: 1,
    showId: 1,
  },
  {
    airDate: new Date('2019-05-13'),
    number: 2,
    overview:
      'With untold millions at risk after the Chernobyl explosion, nuclear physicist Ulana Khomyuk makes a desperate attempt to reach Valery Legasov, a leading Soviet nuclear physicist, and warn him about the threat of second explosion that could devastate the continent.',
    rating: '9.2',
    runtime: 66,
    title: 'Please Remain Calm',
    tmdbStillPath: '/kVsUEtOOYeLRmABVuZztl4k9onO.jpg',
    seasonId: 1,
    showId: 1,
  },
  {
    airDate: new Date('2019-05-20'),
    number: 3,
    overview:
      "Lyudmilla Ignatenko, a Pripyat resident, ignores warning about her firefighter husband's contamination. Valery Legasov lays out a decontamination plan, complete with human risks.",
    rating: '9.0',
    runtime: 64,
    title: 'Open Wide, O Earth',
    tmdbStillPath: '/f3AgIEfGWWO3qNoxymagUqCBaE8.jpg',
    seasonId: 1,
    showId: 1,
  },
  {
    airDate: new Date('2019-05-27'),
    number: 4,
    overview:
      'Valery Legasov and Soviet Deputy Prime Minister Boris Shcherbina consider using lunar rovers to remove radioactive debris, while Ulana Khomyuk faces government hurdles in determining the truth about the cause of the explosion.',
    rating: '8.8',
    runtime: 67,
    title: 'The Happiness of All Mankind',
    tmdbStillPath: '/xV2eVT4ejGhVn9OIMCo4uBOhmCC.jpg',
    seasonId: 1,
    showId: 1,
  },
  {
    airDate: new Date('2019-06-03'),
    number: 5,
    overview:
      'Valery Legasov, Boris Shcherbina and Ulana Khomyuk risk their lives and reputations to expose the truth about Chernobyl.',
    rating: '9.3',
    runtime: 73,
    title: 'Vichnaya Pamyat',
    tmdbStillPath: '/mgXm2Y6SOFDHtD5thi2LmS7uQBj.jpg',
    seasonId: 1,
    showId: 1,
  },
  {
    airDate: new Date('2024-04-11'),
    number: 1,
    overview:
      "Struggling comedian and barman Donny meets a lonely woman claiming to be a lawyer. He offers her a cup of tea on the house, and she's instantly obsessed.",
    rating: '7.6',
    runtime: 33,
    title: 'Episode 1',
    tmdbStillPath: '/cxZFsDNJYuXok0tbBr6wGRcHD8D.jpg',
    seasonId: 2,
    showId: 2,
  },
  {
    airDate: new Date('2024-04-11'),
    number: 2,
    overview:
      'On a date with Teri, Donny opens up about his stalker. Trying to be kind, he gives Martha false hope, which only encourages her further.',
    rating: '7.2',
    runtime: 28,
    title: 'Episode 2',
    tmdbStillPath: '/dYsm3wxygwwb6mSBvgaEIgSxN6O.jpg',
    seasonId: 2,
    showId: 2,
  },
  {
    airDate: new Date('2024-04-11'),
    number: 3,
    overview:
      "Donny takes some time off from the pub and tries to make amends with Teri. But no matter how much he avoids Martha, he can't escape her for long.",
    rating: '8.0',
    runtime: 39,
    title: 'Episode 3',
    tmdbStillPath: '/39YGnnlZisihAO5yJzo31StWWLm.jpg',
    seasonId: 2,
    showId: 2,
  },
  {
    airDate: new Date('2024-04-11'),
    number: 4,
    overview:
      'As Donny reports Martha to the police, it triggers the memory of a traumatic experience he had with a man he met at the Edinburgh Fringe years before.',
    rating: '8.2',
    runtime: 46,
    title: 'Episode 4',
    tmdbStillPath: '/jZBaF3biDBOxk7SzdsJF9EURWoq.jpg',
    seasonId: 2,
    showId: 2,
  },
  {
    airDate: new Date('2024-04-11'),
    number: 5,
    overview:
      "Liz learns the truth about Martha and asks Donny to move out. It's a fresh start for him and Teri, but his memories stop them from getting truly close.",
    rating: '7.4',
    runtime: 29,
    title: 'Episode 5',
    tmdbStillPath: '/juiYyuLtcaik792whB7jZYzWuAC.jpg',
    seasonId: 2,
    showId: 2,
  },
  {
    airDate: new Date('2024-04-11'),
    number: 6,
    overview:
      'Martha finds new ways to get to Donny: by hurting the people he loves. With the police still failing to intervene, he takes matters into his own hands.',
    rating: '8.2',
    runtime: 35,
    title: 'Episode 6',
    tmdbStillPath: '/pqQjoBNbE3VAZ6q3280zciI1Kmd.jpg',
    seasonId: 2,
    showId: 2,
  },
  {
    airDate: new Date('2024-04-11'),
    number: 7,
    overview:
      "For the first time in his career, Donny feels like he's going somewhere. Until he makes one careless mistake that lets Martha explode back into his life.",
    rating: '8.2',
    runtime: 32,
    title: 'Episode 7',
    tmdbStillPath: '/db23JLHDxQ4HSqlsuKFm3YWhlSA.jpg',
    seasonId: 2,
    showId: 2,
  },
  {
    airDate: new Date('2001-09-09'),
    number: 1,
    overview:
      'Easy Company is introduced to Captain Sobel, who has the group undergo hard and unfair training. As a result, Sobel comes into conflict with his men, including Richard Winters, his executive officer. The company is shipped to England to prepare for D-Day.',
    rating: '8.2',
    runtime: 73,
    title: 'Currahee',
    tmdbStillPath: '/ic7AgPLAvWT9Vu3Rzv7AnuyOwVz.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-09-09'),
    number: 2,
    overview:
      'Easy Company lands in Normandy, scattered all across and away from their drop zone. 1st Lt. Meehan, commander of Easy, is killed when his plane suffers a direct hit and 1st Lt. Winters must take command and 1st Lt. Speirs is introduced.',
    rating: '8.2',
    runtime: 52,
    title: 'Day of Days',
    tmdbStillPath: '/4VZgbvmphYRRG7IFhgdUfrrCm2v.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-09-16'),
    number: 3,
    overview:
      'Easy Company are sent to liberate the French village of Carentan, where they lose several men in heavy fighting. The episode focuses on Private Albert Blithe, who struggles with crippling anxiety following the battle.',
    rating: '8.4',
    runtime: 65,
    title: 'Carentan',
    tmdbStillPath: '/122cDgrjc5lFqUZ7cYi8vUVrcrn.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-09-23'),
    number: 4,
    overview:
      'With the addition of many new men, Easy Company heads to Holland to participate in Operation Market Garden and prepare an Allied route into Germany, but they meet stiff German resistance.',
    rating: '8.3',
    runtime: 59,
    title: 'Replacements',
    tmdbStillPath: '/iLbFO6mR2O6Zc2kEBqH6paUnmGA.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-09-30'),
    number: 5,
    overview:
      'Winters writes a report on the challenge of an unexpected resistance to a German attack, and is haunted by his conscience after shooting a teenage German soldier. Operation Pegasus is depicted. Easy Company is called to Bastogne to repel the sudden German counterattack.',
    rating: '8.0',
    runtime: 56,
    title: 'Crossroads',
    tmdbStillPath: '/cEqmw8JM4OtoJaml19jBCIhn1ha.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-10-07'),
    number: 6,
    overview:
      'Easy Company experiences the Battle of the Bulge and have to hold ground near Bastogne while running low on ammunition and other supplies. The episode focuses on medic Eugene "Doc" Roe as he helps out his fellow soldiers where he can, while also scrounging for medical supplies, of which the Company is dangerously low.',
    rating: '8.5',
    runtime: 67,
    title: 'Bastogne',
    tmdbStillPath: '/63DWcTJy36OLYjYt8xQWQpEyp91.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-10-14'),
    number: 7,
    overview:
      "Easy Company battles near Foy, Belgium, losing numerous men. In the episode, the actions of 1st Lt. Norman Dike, the Company's commander, are examined and questioned. Serving as narrator is 1st Sgt. Carwood Lipton, who attempts to keep the morale of the men up as they endure their trials in the forest near Foy.",
    rating: '8.7',
    runtime: 72,
    title: 'The Breaking Point',
    tmdbStillPath: '/io9dffm2TaQTBSw1U9V0vSPyZkF.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-10-21'),
    number: 8,
    overview:
      'Easy Company is in Hagenau in Feburary, 1945, where they prepare for a night patrol mission to capture German prisoners. The patrol includes one veteran who is despised for missing Bastogne and a new lieutenant fresh out of West Point.',
    rating: '8.1',
    runtime: 58,
    title: 'The Last Patrol',
    tmdbStillPath: '/gsAZdpl9rkzg112eHm91Ze7OFDn.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-10-28'),
    number: 9,
    overview:
      'As the Allies move into Germany and the war comes closer to an end, disillusionment and anger set in for Easy Company--until they stumble onto a concentration camp abandoned by the German military.',
    rating: '9.1',
    runtime: 58,
    title: 'Why We Fight',
    tmdbStillPath: '/xxPHVgNQ8kOOBPuVDNEcIon7BVe.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2001-11-04'),
    number: 10,
    overview:
      'As the Germans surrender, it appears that that the hard days for Easy Company are over as they are stationed in Austria. But they soon learn that those solders without enough service points will be sent to fight in Japan.',
    rating: '8.6',
    runtime: 62,
    title: 'Points',
    tmdbStillPath: '/tJCNQhY3fHn1OIwImfZQUIRPbuA.jpg',
    seasonId: 3,
    showId: 3,
  },
  {
    airDate: new Date('2021-10-13'),
    number: 1,
    overview:
      'Richard Sackler begins to launch a powerful new painkiller, a rural doctor is introduced to the drug, a coal miner plans her future, a DEA Agent learns of blackmarket pills, and federal prosecutors decide to open a case into OxyContin.',
    rating: '7.9',
    runtime: 62,
    title: 'First Bottle',
    tmdbStillPath: '/3NZlgalDbq1vjPa8pC5mj4UQRr3.jpg',
    seasonId: 4,
    showId: 4,
  },
  {
    airDate: new Date('2021-10-13'),
    number: 2,
    overview:
      'OxyContin is on the market but faces a potential threat, Purdue’s vast influence reaches the town of Finch Creek, Bridget steps outside her DEA authority, and the criminal investigation of OxyContin begins.',
    rating: '7.8',
    runtime: 62,
    title: 'Breakthrough Pain',
    tmdbStillPath: '/mX2rXthM4L38RSkVRDoWPu2ZePT.jpg',
    seasonId: 4,
    showId: 4,
  },
  {
    airDate: new Date('2021-10-13'),
    number: 3,
    overview:
      'Doctor Finnix begins to taper Betsy off OxyContin, Bridget sees the toll the drug is taking on communities, Rick and Randy investigate the world of “pain societies”, and with sales climbing, Richard Sackler makes bigger plans for his new drug.',
    rating: '8.1',
    runtime: 57,
    title: 'The 5th Vital Sign',
    tmdbStillPath: '/2jNlGPhxkYL1C4vgohWhoXzGfiJ.jpg',
    seasonId: 4,
    showId: 4,
  },
  {
    airDate: new Date('2021-10-20'),
    number: 4,
    overview:
      'Sky-high OxyContin sales are threatened by reports of abuse, prosecutors investigate a claim central to OxyContin marketing, and Finnix begins to question the safety of the drug.',
    rating: '8.4',
    runtime: 61,
    title: 'Pseudo-Addiction',
    tmdbStillPath: '/5GHqObCDh2sAetwxRjQoC4o2yd8.jpg',
    seasonId: 4,
    showId: 4,
  },
  {
    airDate: new Date('2021-10-27'),
    number: 5,
    overview:
      'With OxyContin abuse spreading across the country, Bridget brings the fight to Purdue while Rick and Randy seek to find a whistleblower within Purdue to tie their case together.',
    rating: '8.3',
    runtime: 63,
    title: 'The Whistleblower',
    tmdbStillPath: '/dnfpZudATzp3ZeP6GF4iUfr71Jd.jpg',
    seasonId: 4,
    showId: 4,
  },
  {
    airDate: new Date('2021-11-03'),
    number: 6,
    overview:
      'Richard Sackler faces a catastrophic challenge to Purdue’s bottom line, Bridget takes her fight to the FDA, Finnix reassesses his life as Betsy struggles to kick her addiction, and Rick and Randy find a bombshell piece of evidence.',
    rating: '8.2',
    runtime: 60,
    title: 'Hammer the Abusers',
    tmdbStillPath: '/sfW6ksCiOjEjzHV2jhybR4bhJLz.jpg',
    seasonId: 4,
    showId: 4,
  },
  {
    airDate: new Date('2021-11-10'),
    number: 7,
    overview:
      'Richard Sackler and Purdue work the system to prevent their drug from being reigned in, Bridget has a breakthrough in her mission, Betsy has hit rock-bottom while Finnix explores new avenues, and Rick and Randy ready their criminal case.',
    rating: '8.3',
    runtime: 62,
    title: 'Black Box Warning',
    tmdbStillPath: '/gauWgbzQWjV57vyIs6DNdWCsFKC.jpg',
    seasonId: 4,
    showId: 4,
  },
  {
    airDate: new Date('2021-11-17'),
    number: 8,
    overview:
      'Rick and Randy’s criminal investigation now threatens Richard Sackler’s empire, activists take action against Purdue, and Finnix tries to heal his beloved community that’s been ravaged by addiction.',
    rating: '8.2',
    runtime: 65,
    title: 'The People vs. Purdue Pharma',
    tmdbStillPath: '/gl5LteQDwv4kT2aGO2kmIQDVf8H.jpg',
    seasonId: 4,
    showId: 4,
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
]

export default async () => {
  try {
    const cacheClient = await createClient({ url: process.env.CACHE_HOST })
    await cacheClient.connect()
    await cacheClient.flushDb()
    await cacheClient.disconnect()

    await db.movie.createMany({ data: movies })
    await db.book.createMany({ data: books })
    await db.show.createMany({ data: shows })
    await db.showSeason.createMany({ data: seasons })
    await db.showEpisode.createMany({ data: episodes })
    const showsWithEpisodes = await db.show.findMany({ include: { episodes: true } })

    const s3BucketExists = await minioClient.bucketExists(process.env.MINIO_BUCKET_NAME)
    if (!s3BucketExists) {
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

    const users = [
      {
        username: 'demo',
        password: 'demo',
        movieLists: {
          create: [
            {
              name: 'Watchlist',
              type: MovieListType.WATCHLIST,
              movies: { create: range(1, 3).map((n) => ({ movieId: n })) },
            },
            {
              name: 'Watched',
              type: MovieListType.WATCHED,
              movies: { create: range(4, 9).map((n) => ({ movieId: n })) },
            },
          ],
        },
        watchedEpisodes: {
          create: [
            ...range(1, 2).flatMap((n) => {
              const show = showsWithEpisodes[n]

              return range(0, 3).map((i) => ({
                showId: show.id,
                seasonId: show.episodes[i].seasonId,
                episodeId: show.episodes[i].id,
              }))
            }),
            ...range(3, 3).flatMap((n) => {
              const show = showsWithEpisodes[n]

              return show.episodes.map((e) => ({ showId: e.showId, seasonId: e.seasonId, episodeId: e.id }))
            }),
          ],
        },
        showsWatchlist: { create: { showId: showsWithEpisodes[0].id } },
        abandonedShows: { create: { showId: showsWithEpisodes[1].id } },
        bookLists: {
          create: [
            {
              name: 'Reading List',
              type: BookListType.READING_LIST,
              books: { create: range(1, 6).map((n) => ({ bookId: n })) },
            },
            {
              name: 'Read',
              type: BookListType.READ,
              books: { create: range(7, 9).map((n) => ({ bookId: n })) },
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
              name: 'Full Body',
              date: new Date('2023-11-01'),
              startTime: '2023-11-01T14:00:00Z',
              endTime: '2023-11-01T15:00:15Z',
              durationInSeconds: 3615,
              exercises: {
                create: range(1, 4).map((n, index) => ({
                  order: index + 1,
                  exerciseId: n,
                  sets: { create: range(1, 3).map(() => ({ weightInKg: 50, reps: 12, restInSeconds: 45 })) },
                })),
              },
            },
            {
              name: 'Upper Body',
              date: new Date('2023-10-01'),
              startTime: '2023-10-01T14:00:00Z',
              endTime: '2023-10-01T14:30:30Z',
              durationInSeconds: 1830,
              exercises: {
                create: range(5, 7).map((n, index) => ({
                  order: index + 1,
                  exerciseId: n,
                  sets: { create: range(1, 3).map(() => ({ weightInKg: 50, reps: 12, restInSeconds: 60 })) },
                })),
              },
            },
            {
              name: 'Legs',
              date: new Date('2023-09-01'),
              startTime: '2023-09-01T14:00:00Z',
              endTime: '2023-09-01T14:45:00Z',
              durationInSeconds: 2700,
              exercises: {
                create: range(8, 10).map((n, index) => ({
                  order: index + 1,
                  exerciseId: n,
                  sets: { create: range(1, 3).map(() => ({ weightInKg: 50, reps: 12, restInSeconds: 90 })) },
                })),
              },
            },
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
      },
      {
        username: 'john',
        password: 'john',
        movieLists: {
          create: [
            { name: 'Watchlist', type: MovieListType.WATCHLIST },
            { name: 'Watched', type: MovieListType.WATCHED },
          ],
        },
        bookLists: {
          create: [
            { name: 'Reading List', type: BookListType.READING_LIST },
            { name: 'Read', type: BookListType.READ },
          ],
        },
      },
      {
        username: 'jane',
        password: 'jane',
        movieLists: {
          create: [
            { name: 'Watchlist', type: MovieListType.WATCHLIST },
            { name: 'Watched', type: MovieListType.WATCHED },
          ],
        },
        bookLists: {
          create: [
            { name: 'Reading List', type: BookListType.READING_LIST },
            { name: 'Read', type: BookListType.READ },
          ],
        },
      },
    ]

    for (const { password, ...user } of users) {
      const [hashedPassword, salt] = hashPassword(password)

      await db.user.create({ data: { ...user, hashedPassword, salt } })
    }
  } catch (error) {
    console.error(error)
  }
}
