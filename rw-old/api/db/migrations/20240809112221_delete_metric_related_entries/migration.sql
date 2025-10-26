-- DropForeignKey
ALTER TABLE "MetricEntry" DROP CONSTRAINT "MetricEntry_metricId_fkey";

-- AddForeignKey
ALTER TABLE "MetricEntry" ADD CONSTRAINT "MetricEntry_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
