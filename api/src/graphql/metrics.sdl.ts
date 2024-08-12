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

  input MetricEntryInput {
    value: String!
    date: Date!
  }

  input CreateMetricInput {
    name: String!
    unit: String
    entry: MetricEntryInput
  }

  input UpdateMetricInput {
    name: String
    unit: String
  }

  input CreateMetricEntryInput {
    value: String!
    date: Date!
    metricId: Int!
  }

  input UpdateMetricEntryInput {
    value: String
    date: Date
  }

  type Mutation {
    createMetric(input: CreateMetricInput!): Metric! @requireAuth
    updateMetric(id: Int!, input: UpdateMetricInput!): Metric! @requireAuth
    deleteMetric(id: Int!): Metric! @requireAuth
    createMetricEntry(input: CreateMetricEntryInput!): MetricEntry! @requireAuth
    updateMetricEntry(id: Int!, input: UpdateMetricEntryInput!): MetricEntry! @requireAuth
    deleteMetricEntry(id: Int!): MetricEntry! @requireAuth
  }
`
