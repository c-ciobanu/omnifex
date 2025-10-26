import { BarChart3, Check, ExternalLink, FileText, Github, Play, Server } from 'lucide-react'

import { Metadata } from '@redwoodjs/web'

import Logo from 'src/components/logo'
import { Button } from 'src/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'
import { Separator } from 'src/components/ui/separator'

const images = [
  { src: '/img/home/movies.png', alt: 'Movies Watchlist' },
  { src: '/img/home/document.png', alt: 'Document' },
  { src: '/img/home/metrics.png', alt: 'Metrics' },
]

const LandingPage = () => {
  return (
    <>
      <Metadata title="Landing" description="Landing page" />

      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold">omnifex</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Join
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 md:py-32">
          <div className="container max-w-4xl space-y-8 px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              An{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All-in-One
              </span>{' '}
              platform for all your needs
            </h1>

            <p className="text-xl text-gray-600 md:text-2xl">
              Movies, shows, books, documents, invoices, and more—all in one self-hostable platform. Take control of
              your digital life.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-12 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-lg hover:from-blue-700 hover:to-purple-700"
              >
                Join Now
                <ExternalLink />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 gap-2 border-green-600 bg-green-600 text-lg text-white hover:bg-green-700"
              >
                Try Demo
                <Play />
              </Button>
              <Button size="lg" variant="outline" className="h-12 gap-2 text-lg">
                View on GitHub
                <Github />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                No vendor lock-in
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Open source
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Self-Hostable
              </div>
            </div>
          </div>

          <Carousel opts={{ loop: true }} className="mx-auto mt-16 w-full max-w-72 md:max-w-6xl">
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.src}>
                  <img src={image.src} alt={image.alt} className="w-full" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section className="py-20 md:py-32">
          <div className="container px-4">
            <div className="mx-auto mb-16 max-w-2xl space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Everything you need in one place</h2>
              <p className="text-xl text-gray-600">
                StreamLine combines entertainment tracking, productivity tools, and personal analytics into a single,
                powerful platform.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Entertainment Hub</h3>
                <p className="text-gray-600">
                  Track movies, TV shows, and books. Manage your watchlists and reading lists effortlessly.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Document Collaboration</h3>
                <p className="text-gray-600">
                  Create and share documents with a powerful web editor, similar to Google Docs.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Personal Analytics</h3>
                <p className="text-gray-600">
                  Track metrics like weight, steps, and habits with beautiful graphs and insights.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Server className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Self-Hostable</h3>
                <p className="text-gray-600">
                  Deploy on your own infrastructure for complete privacy and control over your data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Separator />

      <footer className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <section className="flex justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p>Movie data provided by</p>
              <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
                <img
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                  alt="TMDB logo"
                  className="w-28"
                />
              </a>
            </div>

            <p>
              Icons by{' '}
              <a href="https://icons8.com" target="_blank" rel="noreferrer">
                Icons8
              </a>
            </p>

            <p>
              Sound effects from{' '}
              <a
                href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music"
                target="_blank"
                rel="noreferrer"
              >
                Pixabay
              </a>
            </p>
          </div>

          <a href="https://github.com/c-ciobanu/omnifex" target="_blank" rel="noreferrer">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </section>

        <Separator className="my-4" />

        <div className="text-center text-sm text-gray-700">
          <p>&copy; {new Date().getFullYear()} Cristi Ciobanu</p>
        </div>
      </footer>
    </>
  )
}

export default LandingPage
