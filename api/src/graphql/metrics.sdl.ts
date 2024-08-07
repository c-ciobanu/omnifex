export const schema = gql`
  type Metric {
    id: Int!
    name: String!
    unit: String
    entries: [MetricEntry!]!
    latestEntry: MetricEntry!
  }

  type MetricEntry {
    id: Int!
    value: String!
    date: Date!
  }

  type Query {
    metrics: [Metric!]! @requireAuth
    metric(id: Int!): Metric @requireAuth
  }

  input CreateMetricInput {
    name: String!
    unit: String
  }

  input UpdateMetricInput {
    name: String
    unit: String
  }

  type Mutation {
    createMetric(input: CreateMetricInput!): Metric! @requireAuth
    updateMetric(id: Int!, input: UpdateMetricInput!): Metric! @requireAuth
    deleteMetric(id: Int!): Metric! @requireAuth
  }
`
