import { checkMovieChangesQueue } from "../queues";

export async function upsertCronJobs() {
  await checkMovieChangesQueue.upsertJobScheduler("check-movie-changes-scheduler", {
    pattern: "0 2 * * 4", // 02:00 on Thursday
  });
}
