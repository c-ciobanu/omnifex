import type { Prisma, Book, User, ToReadBook, ReadBook } from '@prisma/client'

export const standard = defineScenario<
  Prisma.BookCreateArgs | Prisma.UserCreateArgs | Prisma.ToReadBookCreateArgs | Prisma.ReadBookCreateArgs
>({
  book: {
    cleanCode: {
      data: {
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
    },
    thePassenger: {
      data: {
        authors: ['Cormac McCarthy'],
        description:
          "<p><b>A sunken jet, a missing body, and a salvage diver entering a conspiracy beyond all understanding. From the bar rooms of New Orleans to an abandoned oil rig off the Florida coast, <i>The Passenger</i> is a breathtakingly dark novel from Cormac McCarthy, the legendary author of <i>No Country for Old Men </i>and <i>The Road</i>.<br><br>‘A gorgeous ruin in the shape of a hardboiled noir thriller . . . What a glorious sunset song’ – <i>The Guardian</i></b><br><br>1980, Mississippi. It is three in the morning when Bobby Western zips the jacket of his wet suit and plunges into the darkness of the ocean. His dive light illuminates a sunken jet, nine bodies still buckled in their seats, hair floating, eyes devoid of speculation. Missing from the crash site are the pilot's flight bag, the plane's black box – and the tenth passenger . . .<br><br>Now a collateral witness to this disappearance, Bobby is discouraged from speaking of what he has seen. He is a man haunted: by the ghost of his father, inventor of the bomb that melted glass and flesh in Hiroshima, and by his sister, the love and ruin of his soul.<br><br><b>One of the final works by Cormac McCarthy, <i>The Passenger</i> is book one in a duology. It is followed by <i>Stella Maris</i>.</b><br><br>Praise for Cormac McCarthy:<br><br>‘McCarthy worked close to some religious impulse, his books were terrifying and absolute’ – Anne Enright, author of <i>The Green Road</i><br><br>'His prose takes on an almost biblical quality, hallucinatory in its effect and evangelical in its power' – Stephen King, author of <i>The Shining</i><br><br>'[I]n presenting the darker human impulses in his rich prose, [McCarthy] showed readers the necessity of facing up to existence' – Annie Proulx, author of<i> Brokeback Mountain</i></p>",
        genres: [
          'Fiction / Literary',
          'Fiction / Psychological',
          'Fiction / Thrillers / Psychological',
          'Fiction / Family Life / Siblings',
          'Fiction / Southern',
          'Fiction / Thrillers / Suspense',
          'Fiction / General',
        ],
        googleId: 'wBFjEAAAQBAJ',
        pages: 400,
        publicationDate: new Date('2022-10-25'),
        subtitle: null,
        title: 'The Passenger',
      },
    },
    theBerryPickers: {
      data: {
        authors: ['Amanda Peters'],
        description:
          '<b>NATIONAL BESTSELLER<br>2023 Barnes & Noble Discover Prize Winner<br>Winner of the Andrew Carnegie Medal for Excellence in Fiction<br><br> A four-year-old Mi’kmaq girl goes missing from the blueberry fields of Maine, sparking a mystery that will haunt the survivors, unravel a family, and remain unsolved for nearly fifty years<br><br>"A stunning debut about love, race, brutality, and the balm of forgiveness." —<i>People</i>, A Best New Book</b><br><br>July 1962. A Mi’kmaq family from Nova Scotia arrives in Maine to pick blueberries for the summer. Weeks later, four-year-old Ruthie, the family’s youngest child, vanishes. She is last seen by her six-year-old brother, Joe, sitting on a favorite rock at the edge of a berry field. Joe will remain distraught by his sister’s disappearance for years to come. <br><br>In Maine, a young girl named Norma grows up as the only child of an affluent family. Her father is emotionally distant, her mother frustratingly overprotective. Norma is often troubled by recurring dreams and visions that seem more like memories than imagination. As she grows older, Norma slowly comes to realize there is something her parents aren’t telling her. Unwilling to abandon her intuition, she will spend decades trying to uncover this family secret. <br><br>For readers of <i>The Vanishing Half</i> and <i>Woman of Light</i>, this showstopping debut by a vibrant new voice in fiction is a riveting novel about the search for truth, the shadow of trauma, and the persistence of love across time.<br><br><b>"A harrowing tale of Indigenous family separation . . . [Peters] excels in writing characters for whom we can’t help rooting . . . With <i>The Berry Pickers</i>, Peters takes on the monumental task of giving witness to people who suffered through racist attempts of erasure like her Mi’kmaw ancestors." —<i>The New York Times Book Review</i></b>',
        genres: ['Fiction / Indigenous', 'Fiction / Coming of Age', 'Fiction / Family Life / Siblings'],
        googleId: 'lo-rEAAAQBAJ',
        pages: 320,
        publicationDate: new Date('2023-10-31'),
        subtitle: 'A Novel',
        title: 'The Berry Pickers',
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
  toReadBook: {
    one: (scenario) => ({
      data: {
        bookId: scenario.book.cleanCode.id,
        userId: scenario.user.john.id,
      },
    }),
  },
  readBook: {
    one: (scenario) => ({
      data: {
        bookId: scenario.book.thePassenger.id,
        userId: scenario.user.john.id,
      },
    }),
  },
})

export type StandardScenario = {
  book: Record<'cleanCode' | 'thePassenger' | 'theBerryPickers', Book>
  user: Record<'john', User>
  toReadBook: Record<'one', ToReadBook>
  readBook: Record<'one', ReadBook>
}
