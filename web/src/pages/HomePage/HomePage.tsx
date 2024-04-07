import { Metadata } from '@redwoodjs/web'

import happyPopcorn from './happy-popcorn.svg'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <div className="min-h-main flex flex-col items-center justify-center">
        <p>Popcorn is ready!</p>
        <p>Want to watch a movie or maybe read a book?</p>
        <p>It&#39;s up to you.</p>
        <img src={happyPopcorn} alt="Popcorn" title="Happy Popcorn!" />
      </div>
    </>
  )
}

export default HomePage
