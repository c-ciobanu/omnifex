import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

type MetricPageProps = {
  metricId: number
}

const MetricPage = ({ metricId }: MetricPageProps) => {
  return (
    <>
      <Metadata title="Metric" description="Metric page" />

      <h1>MetricPage</h1>
      <p>
        Find me in <code>./web/src/pages/MetricPage/MetricPage.tsx</code>
      </p>
      <p>
        My default route is named <code>metric</code>, link to me with `
        <Link to={routes.metric({ metricId })}>Metric 42</Link>`
      </p>
      <p>The parameter passed to me is {metricId}</p>
    </>
  )
}

export default MetricPage
