import { db } from 'api/src/lib/db'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

export default async () => {
  try {
    const users = [
      { email: 'john@doe.com', password: 'john1234' },
      { email: 'jane@doe.com', password: 'jane1234' },
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
        authors: ['Robert C. Martin'],
        description:
          'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn’t have to be that way. <br> <br>Noted software expert Robert C. Martin presents a revolutionary paradigm with <i><b>Clean Code: A Handbook of Agile Software Craftsmanship</b></i>. Martin has teamed up with his colleagues from Object Mentor to distill their best agile practice of cleaning code “on the fly” into a book that will instill within you the values of a software craftsman and make you a better programmer–but only if you work at it. <br> <br>What kind of work will you be doing? You’ll be reading code–lots of code. And you will be challenged to think about what’s right about that code, and what’s wrong with it. More importantly, you will be challenged to reassess your professional values and your commitment to your craft. <br> <br> <i><b>Clean Code</b></i> is divided into three parts. The first describes the principles, patterns, and practices of writing clean code. The second part consists of several case studies of increasing complexity. Each case study is an exercise in cleaning up code–of transforming a code base that has some problems into one that is sound and efficient. The third part is the payoff: a single chapter containing a list of heuristics and “smells” gathered while creating the case studies. The result is a knowledge base that describes the way we think when we write, read, and clean code. <br> <br>Readers will come away from this book understanding <br> <ul> <li>How to tell the difference between good and bad code </li> <li>How to write good code and how to transform bad code into good code </li> <li>How to create good names, good functions, good objects, and good classes </li> <li>How to format code for maximum readability </li> <li>How to implement complete error handling without obscuring code logic </li> <li>How to unit test and practice test-driven development</li> </ul>This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code. <br>',
        genres: [
          'Computers / Software Development & Engineering / General',
          'Computers / Software Development & Engineering / Quality Assurance & Testing',
        ],
        googleId: '_i6bDeoCQzsC',
        pages: 464,
        publicationDate: new Date('2008-08-01'),
        subtitle: 'A Handbook of Agile Software Craftsmanship',
        title: 'Clean Code',
      },
      {
        authors: ['Robert C. Martin'],
        description:
          '<p><b>Practical Software Architecture Solutions from the Legendary Robert C. Martin (“Uncle Bob”)</b></p> <p> </p> <p>By applying universal rules of software architecture, you can dramatically improve developer productivity throughout the life of any software system. Now, building upon the success of his best-selling books <i>Clean Code</i> and <i>The Clean Coder,</i> legendary software craftsman Robert C. Martin (“Uncle Bob”) reveals those rules and helps you apply them.</p> <p> </p> <p>Martin’s <i><b>Clean Architecture</b></i> doesn’t merely present options. Drawing on over a half-century of experience in software environments of every imaginable type, Martin tells you what choices to make and why they are critical to your success. As you’ve come to expect from Uncle Bob, this book is packed with direct, no-nonsense solutions for the real challenges you’ll face–the ones that will make or break your projects.</p> <ul> <li>Learn what software architects need to achieve–and core disciplines and practices for achieving it</li> <li>Master essential software design principles for addressing function, component separation, and data management</li> <li>See how programming paradigms impose discipline by restricting what developers can do</li> <li>Understand what’s critically important and what’s merely a “detail”</li> <li>Implement optimal, high-level structures for web, database, thick-client, console, and embedded applications</li> <li>Define appropriate boundaries and layers, and organize components and services</li> <li>See why designs and architectures go wrong, and how to prevent (or fix) these failures</li> </ul> <p><i><b>Clean Architecture</b></i> is essential reading for every current or aspiring software architect, systems analyst, system designer, and software manager–and for every programmer who must execute someone else’s designs.</p> <p><br></p> <p> </p> <p><i>Register your product for convenient access to downloads, updates, and/or corrections as they become available.</i></p>',
        genres: [
          'Computers / Software Development & Engineering / General',
          'Computers / Software Development & Engineering / Quality Assurance & Testing',
        ],
        googleId: 'uGE1DwAAQBAJ',
        pages: 432,
        publicationDate: new Date('2017-09-12'),
        subtitle: "A Craftsman's Guide to Software Structure and Design",
        title: 'Clean Architecture',
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
        subtitle: null,
        title: 'Food: A Love Story',
      },
    ]

    await db.user.createMany({
      data: users.map((user) => {
        const [hashedPassword, salt] = hashPassword(user.password)
        return { email: user.email, hashedPassword, salt }
      }),
    })
    await db.movie.createMany({ data: movies })
    await db.book.createMany({ data: books })
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
