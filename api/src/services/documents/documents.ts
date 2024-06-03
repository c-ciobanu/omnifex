import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { generatePresignedGetUrl, generatePresignedPutUrl } from 'src/lib/minio'

export const documentsUrl: QueryResolvers['documentsUrl'] = async () => {
  requireAuth()

  const url = await generatePresignedGetUrl(context.currentUser.id.toString())

  return url
}

export const createDocumentsUploadUrl: MutationResolvers['createDocumentsUploadUrl'] = async () => {
  requireAuth()

  const url = await generatePresignedPutUrl(context.currentUser.id.toString())

  return url
}
