import { db } from 'api/src/lib/db'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

export default async () => {
  try {
    const users = [
      {
        username: 'john',
        email: 'john@doe.com',
        password: 'john1234',
        favoritedMovies: { create: [{ movieId: 1 }] },
        watchedMovies: { create: [{ movieId: 1 }, { movieId: 3 }] },
        moviesToWatch: { create: [{ movieId: 2 }] },
        favoritedBooks: { create: { bookId: 1 } },
        readBooks: { create: [{ bookId: 1 }, { bookId: 3 }] },
        booksToRead: { create: { bookId: 2 } },
      },
      { username: 'jane', password: 'jane1234' },
    ]
    const movies = [
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
      },
      {
        genres: ['Comedy', 'Science Fiction', 'Adventure'],
        imdbId: 'tt0387808',
        overview:
          "To test its top-secret Human Hibernation Project, the Pentagon picks the most average Americans it can find - an Army private and a prostitute - and sends them to the year 2505 after a series of freak events. But when they arrive, they find a civilization so dumbed-down that they're the smartest people around.",
        rating: '6.3',
        releaseDate: new Date('2006-09-01'),
        runtime: 84,
        tagline: 'In the future, intelligence is extinct.',
        title: 'Idiocracy',
        tmdbId: 7512,
        tmdbPosterPath: '/rKsiNxKjhWEwndOgWPs273oy9EZ.jpg',
      },
    ]
    const books = [
      {
        authors: ['Bryan Cranston'],
        description:
          "<p><b>'A CINEMATIC RECORD OF HOW AN ACTOR SHAPES A CAREER' </b><i>Tom Hanks</i><br><b>'FUNNY, SAD AND HEARTFELT</b>' <i>Vince Gilligan</i><br><b>'GRITTY, FUNNY AND SAD' </b><i>Entertainment Weekly</i><br><b>'A SUPERB ANECDOTALIST'</b><i> Sunday Times Culture</i><br><b>'RIVETING... ENGROSSING' </b><i>Huffington Post<br></i><br>BRYAN CRANSTON maps his journey from abandoned son to beloved star, recalling the many odd parts he's played in real life, and chronicles his evolution on camera. For the first time he shares the story of his early years, from his time as a soap opera regular to his recurring spots on <i>Seinfeld </i>and his role as bumbling father Hal on <i>Malcolm in the Middle</i>, along with an inspiring account of how he prepared for the award-winning role of President Lyndon Johnson.<br><br>Of course, Cranston dives deep into the grittiest details of his greatest role, explaining how he searched inward for the personal darkness that would help him create one of the most memorable performances ever captured on screen: <b><i>Breaking Bad</i>'s Walter White</b>.<br><br><i><b>A LIFE IN PARTS</b></i> is a story about the joy, the necessity, and the transformative power of simple hard work.</p>",
        genres: [
          'Biography & Autobiography / Entertainment & Performing Arts',
          'Biography & Autobiography / Personal Memoirs',
          'Self-Help / Substance Abuse & Addictions / Drugs',
          'Performing Arts / Television / General',
          'Business & Economics / Industries / Media & Communications',
          'Social Science / Criminology',
        ],
        googleId: 'GAqNBwAAQBAJ',
        pages: 288,
        publicationDate: new Date('2016-10-20'),
        title: 'A Life in Parts',
      },
      {
        authors: ['Joey Diaz'],
        description:
          '<b><i>New York Times</i> Bestseller<br><br><br>Outsider. Misfit. Criminal. Convict. . . . Movie star. Family man. Comedy legend.<br><br>Joey Diaz has been called every name in the book (and then some). Now, for the first time, he shares the story of his unlikely rise to fame in his own words—with no punches pulled.</b><br><br>Today, he stars in hit films, headlines sold-out tours, hosts the popular <i>Uncle Joey’s Joint</i> podcast, and is a devoted father—but his life wasn’t always so picture-perfect. Joey “Coco” Diaz credits his success to his “immigrant mentality,” the work ethic his mother modeled for him and on which countless others have depended to survive the harsh landscape of being an outsider.<br><br>Diaz wasn’t always a star, but he was always a comedian—it just took him a while to figure it out. To be fair, he was pretty busy while he was young: helping his tough-as-nails mother in her bar, holding a gun for the first time at the age of six, and later dealing drugs and serving time.<br><br><i>Tremendous</i> is the story of Diaz’s life, from grueling childhood and misspent youth to finding his true calling in comedy. Immigrants, fans of celebrity tales, and comedy enthusiasts alike will be enthralled by this incredibly true, foul-mouthed, and funny memoir.<br><br>It’s not a story for the faint of heart, or for prudes who’ve never spent a week sleeping in a piece of playground equipment. From finding his mom’s body to high stakes crime, addiction and depression, there are plenty of dark episodes in this saga. Diaz shares it all with brutal honesty and humor, in the same inimitable voice he’d use talking to you from the stage or in a bar. He also shares the story of his improbable rise to the top and the bumpy road that led him there.<br><br>An inspiration to misfits everywhere, <i>Tremendous</i> is storytelling at its finest—and a reminder that the direst of circumstances can change in unimaginable, unpredictable ways.',
        genres: [
          'Biography & Autobiography / Rich & Famous',
          'Performing Arts / Comedy',
          'Biography & Autobiography / Cultural, Ethnic & Regional / Hispanic & Latino',
        ],
        googleId: 'HRt_EAAAQBAJ',
        pages: 280,
        publicationDate: new Date('2023-05-02'),
        subtitle: 'The Life of a Comedy Savage',
        title: 'Tremendous',
      },
      {
        authors: ['Jim Gaffigan'],
        description:
          '<b><i>NEW YORK TIMES</i> BESTSELLER • “A brilliantly funny tribute to the simple pleasures of eating” (<i>Parade</i>) from the author of <i>Dad Is Fat</i></b><br><br>Have you ever finished a meal that tasted horrible but not noticed until the last bite? Eaten in your car so you wouldn’t have to share with your children? Gotten hungry while watching a dog food commercial? Does the presence of green vegetables make you angry?<br>  <br> If you answered yes to any of the following questions, you are pretty pathetic, but you are not alone. Feast along with America’s favorite food comedian, bestselling author, and male supermodel Jim Gaffigan as he digs into his specialty: stuffing his face. <i>Food: A Love Story </i>is an in-depth, thoroughly uninformed look at everything from health food to things that people actually enjoy eating.',
        genres: [
          'Humor / Form / Essays',
          'Humor / Form / Anecdotes & Quotations',
          'Biography & Autobiography / Culinary',
        ],
        googleId: 'FXiBAwAAQBAJ',
        pages: 352,
        publicationDate: new Date('2014-10-21'),
        title: 'Food: A Love Story',
      },
    ]

    await db.movie.createMany({ data: movies })
    await db.book.createMany({ data: books })

    for (const { password, ...user } of users) {
      const [hashedPassword, salt] = hashPassword(password)

      await db.user.create({ data: { ...user, hashedPassword, salt } })
    }
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
