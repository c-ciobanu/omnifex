import { Metadata } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <Metadata
        title="Movies & Books"
        description="Track things you&#39;ve watched and read. Save those you want to see and read."
      />

      <div className="min-h-main flex flex-col items-center justify-center">
        <p>Popcorn is ready!</p>
        <p>Want to watch a movie or maybe read a book?</p>
        <p>It&#39;s up to you.</p>
        <img src="/img/logo.svg" alt="Popcorn" title="Happy Popcorn!" />
      </div>
    </>
  )
}

export default HomePage
