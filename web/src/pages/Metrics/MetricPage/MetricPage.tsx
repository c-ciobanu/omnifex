import MetricCell from './MetricCell'

type MetricPageProps = {
  id: number
}

const MetricPage = ({ id }: MetricPageProps) => {
  return <MetricCell id={id} />
}

export default MetricPage
