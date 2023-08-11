import { MetaTags } from '@redwoodjs/web'

import happyPopcorn from './happy-popcorn.svg'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className="flex min-h-[inherit] flex-col items-center justify-center">
        <p>Popcorn is ready!</p>
        <p>What do you want to watch?</p>
        <img src={happyPopcorn} alt="Popcorn" title="Happy Popcorn!" />
      </div>
    </>
  )
}

export default HomePage
