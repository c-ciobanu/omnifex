import { Metadata } from '@redwoodjs/web'

import happyPopcorn from './happy-popcorn.svg'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <div className="min-h-main flex flex-col items-center justify-center">
        <p>Popcorn is ready!</p>
        <p>What do you want to watch?</p>
        <img src={happyPopcorn} alt="Popcorn" title="Happy Popcorn!" />
      </div>
    </>
  )
}

export default HomePage
