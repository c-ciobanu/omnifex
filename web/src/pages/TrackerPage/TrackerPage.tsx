import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const TrackerPage = () => {
  return (
    <>
      <Metadata title="Tracker" description="Tracker page" />

      <h1>TrackerPage</h1>
      <p>
        Find me in <code>./web/src/pages/TrackerPage/TrackerPage.tsx</code>
      </p>
      <p>
        My default route is named <code>tracker</code>, link to me with `<Link to={routes.tracker()}>Tracker</Link>`
      </p>
    </>
  )
}

export default TrackerPage
