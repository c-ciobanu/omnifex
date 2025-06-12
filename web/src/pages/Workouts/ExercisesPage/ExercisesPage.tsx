import { Metadata } from '@redwoodjs/web'

import ExercisesCell from './ExercisesCell'

const ExercisesPage = () => {
  return (
    <>
      <Metadata title="Exercises" robots="noindex" />

      <ExercisesCell />
    </>
  )
}

export default ExercisesPage
