import { fetch } from '@whatwg-node/fetch'

interface GoogleBook {
  kind: 'books#volume'
  id: string
  etag: string
  selfLink: string
  volumeInfo: {
    title: string
    subtitle?: string
    authors: string[]
    publisher: string
    publishedDate: string
    description?: string
    industryIdentifiers: {
      type: string
      identifier: string
    }[]
    pageCount?: number
    dimensions: {
      height: string
      width: string
      thickness: string
    }
    printType: string
    mainCategory?: string
    categories?: string[]
    averageRating?: number
    ratingsCount: number
    contentVersion: string
    imageLinks?: {
      smallThumbnail: string
      thumbnail: string
      small: string
      medium: string
      large: string
      extraLarge: string
    }
    language: string
    previewLink: string
    infoLink: string
    canonicalVolumeLink: string
  }
}

export const searchGoogleBooks = async ({ title }: { title: string }) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${new URLSearchParams({
      q: title,
      printType: 'books',
      maxResults: '18',
      orderBy: 'relevance',
      key: process.env.GOOGLE_BOOKS_API_KEY,
    })}`,
    { method: 'GET', headers: { accept: 'application/json' } }
  )
  const json: { items: GoogleBook[] } = await response.json()

  return json.items
}

export const getGoogleBook = async (googleId: string) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${googleId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`,
    { method: 'GET', headers: { accept: 'application/json' } }
  )
  const json: GoogleBook = await response.json()

  return json
}
