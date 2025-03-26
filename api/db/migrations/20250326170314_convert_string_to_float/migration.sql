-- AlterTable
ALTER TABLE "MetricEntry" ALTER COLUMN "value" TYPE DOUBLE PRECISION USING value::double precision;
