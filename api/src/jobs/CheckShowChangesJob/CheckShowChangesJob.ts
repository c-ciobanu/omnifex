import { UpdateShowJob } from 'src/jobs/UpdateShowJob/UpdateShowJob'
import { db } from 'src/lib/db'
import { jobs, later } from 'src/lib/jobs'
import { getTMDBShowChanges } from 'src/lib/tmdb'

export const CheckShowChangesJob = jobs.createJob({
  queue: 'default',
  perform: async () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    const to = date.toISOString().slice(0, 10)
    date.setDate(date.getDate() - 6)
    const from = date.toISOString().slice(0, 10)

    const data = await getTMDBShowChanges(1, from, to)

    const results = data.results.map((e) => e.id)

    for (let index = 2; index <= data.total_pages; index++) {
      const otherChanges = await getTMDBShowChanges(index, from, to)

      results.push(...otherChanges.results.map((e) => e.id))
    }

    const showsToUpdate = await db.show.findMany({ where: { tmdbId: { in: results } }, select: { tmdbId: true } })

    for (const show of showsToUpdate) {
      await later(UpdateShowJob, [show.tmdbId])
    }

    const nextRun = new Date()
    nextRun.setDate(nextRun.getDate() + 7)
    nextRun.setHours(12, 0, 0, 0)

    await later(CheckShowChangesJob, [], { waitUntil: nextRun })
  },
})
