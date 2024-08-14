import { books } from '@googleapis/books'

const booksAPI = books({
  version: 'v1',
  auth: process.env.GOOGLE_BOOKS_API_KEY,
})

export const searchGoogleBooks = async ({ title }: { title: string }) => {
  const response = await booksAPI.volumes.list({
    q: title,
    printType: 'books',
    langRestrict: 'en',
    maxResults: 40,
    orderBy: 'relevance',
  })

  return response.data.items
}

export const getGoogleBook = async (googleId: string) => {
  const response = await booksAPI.volumes.get({ volumeId: googleId })

  return response.data
}
