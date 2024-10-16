import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const documents: QueryResolvers['documents'] = () => {
  requireAuth()

  return db.document.findMany({ where: { userId: context.currentUser.id }, orderBy: { updatedAt: 'desc' } })
}

export const document: QueryResolvers['document'] = async ({ id }) => {
  const document = await db.document.findUnique({ where: { id } })

  if (document && (document.isPublic || document.userId === context.currentUser?.id)) {
    return { ...document, isEditable: document.userId === context.currentUser?.id }
  }

  return null
}

export const createDocument: MutationResolvers['createDocument'] = ({ input }) => {
  requireAuth()

  return db.document.create({ data: { ...input, userId: context.currentUser.id } })
}

export const updateDocument: MutationResolvers['updateDocument'] = ({ id, input }) => {
  requireAuth()

  return db.document.update({ data: input, where: { id, userId: context.currentUser.id } })
}

export const deleteDocument: MutationResolvers['deleteDocument'] = ({ id }) => {
  requireAuth()

  return db.document.delete({ where: { id, userId: context.currentUser.id } })
}
