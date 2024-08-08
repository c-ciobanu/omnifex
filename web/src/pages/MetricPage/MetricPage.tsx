import MetricCell from './MetricCell'

type MetricPageProps = {
  metricId: number
}

const MetricPage = ({ metricId }: MetricPageProps) => {
  return <MetricCell id={metricId} />
}

export default MetricPage
