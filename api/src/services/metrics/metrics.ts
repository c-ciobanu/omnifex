import type { QueryResolvers, MutationResolvers, MetricRelationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const metrics: QueryResolvers['metrics'] = () => {
  requireAuth()

  return db.metric.findMany({ where: { userId: context.currentUser.id } })
}

export const metric: QueryResolvers['metric'] = ({ id }) => {
  requireAuth()

  return db.metric.findUnique({ where: { id, userId: context.currentUser.id } })
}

export const createMetric: MutationResolvers['createMetric'] = ({ input }) => {
  requireAuth()

  return db.metric.create({ data: { ...input, userId: context.currentUser.id } })
}

export const updateMetric: MutationResolvers['updateMetric'] = ({ id, input }) => {
  requireAuth()

  return db.metric.update({ data: input, where: { id, userId: context.currentUser.id } })
}

export const deleteMetric: MutationResolvers['deleteMetric'] = ({ id }) => {
  requireAuth()

  return db.metric.delete({ where: { id, userId: context.currentUser.id } })
}

export const Metric: MetricRelationResolvers = {
  entries: (_obj, { root }) => db.metric.findUnique({ where: { id: root.id } }).entries(),
  latestEntry: async (_obj, { root }) => {
    const metrics = await db.metric.findUnique({ where: { id: root.id } }).entries({
      take: 1,
      orderBy: { date: 'desc' },
    })

    return metrics[0]
  },
}
