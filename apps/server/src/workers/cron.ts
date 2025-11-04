import { checkMovieChangesQueue, checkShowChangesQueue } from "../queues";

export async function upsertCronJobs() {
  await checkMovieChangesQueue.upsertJobScheduler("check-movie-changes-scheduler", {
    pattern: "0 2 * * 3", // 02:00 on Wednesday
  });

  await checkShowChangesQueue.upsertJobScheduler("check-show-changes-scheduler", {
    pattern: "0 2 * * 4", // 02:00 on Thursday
  });
}
