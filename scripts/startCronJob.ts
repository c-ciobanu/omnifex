import { db } from 'api/src/lib/db'

const cronJobs = {
  CheckShowChangesJob: { name: 'CheckShowChangesJob', path: 'CheckShowChangesJob/CheckShowChangesJob' },
  CheckMovieChangesJob: { name: 'CheckMovieChangesJob', path: 'CheckMovieChangesJob/CheckMovieChangesJob' },
}

interface Args {
  job: keyof typeof cronJobs
}

export default async ({ args }: { args: Args }) => {
  if (!args.job) {
    throw new Error('job arg required')
  }

  const job = cronJobs[args.job]

  if (!job) {
    throw new Error('cron job not found')
  }

  const count = await db.backgroundJob.count({ where: { handler: { contains: job.name } } })

  if (count !== 0) {
    throw new Error('cron job already running')
  }

  await db.backgroundJob.create({
    data: {
      handler: `{"name":"${job.name}","path":"${job.path}","args":[]}`,
      queue: 'default',
      priority: 50,
      runAt: new Date(),
    },
  })
}
