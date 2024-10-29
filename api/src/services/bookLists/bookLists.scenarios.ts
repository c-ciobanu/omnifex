import type { Prisma, Book, User, BookList } from '@prisma/client'
import { BookListItem } from 'types/graphql'

export const standard = defineScenario<
  Prisma.BookCreateArgs | Prisma.UserCreateArgs | Prisma.BookListCreateArgs | Prisma.BookListItemCreateArgs
>({
  book: {
    toParadise: {
      data: {
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
    },
    theWinners: {
      data: {
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
    },
    nonaTheNinth: {
      data: {
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
    },
  },
  user: {
    john: (scenario) => ({
      data: {
        username: 'john',
        hashedPassword: 'String',
        salt: 'String',
        bookLists: {
          create: [{ name: 'Read', books: { create: { bookId: scenario.book.nonaTheNinth.id } } }],
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
  bookList: {
    one: (scenario) => ({
      data: {
        name: 'Reading List',
        userId: scenario.user.john.id,
      },
    }),
    two: (scenario) => ({
      data: {
        name: 'Reading List',
        userId: scenario.user.jane.id,
        books: {
          create: [
            {
              bookId: scenario.book.toParadise.id,
            },
          ],
        },
      },
    }),
  },
  bookListItem: {
    one: (scenario) => ({
      data: {
        listId: scenario.bookList.one.id,
        bookId: scenario.book.toParadise.id,
      },
    }),
  },
})

export type StandardScenario = {
  book: Record<'toParadise' | 'theWinners' | 'nonaTheNinth', Book>
  user: Record<'john', User>
  bookList: Record<'one' | 'two', BookList>
  bookListItem: Record<'one', BookListItem>
}
