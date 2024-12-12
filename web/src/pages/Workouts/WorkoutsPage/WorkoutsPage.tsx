import { Metadata } from '@redwoodjs/web'

import WorkoutsCell from './WorkoutsCell'

const WorkoutsPage = () => {
  return (
    <>
      <Metadata title="Workouts" robots="noindex" />

      <WorkoutsCell />
    </>
  )
}

export default WorkoutsPage
