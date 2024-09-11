import { db } from 'src/lib/db'
import { jobs } from 'src/lib/jobs'

export const DeleteTemporaryUserJob = jobs.createJob({
  queue: 'default',
  perform: async (userId: number) => {
    await db.user.delete({ where: { id: userId } })
  },
})
