-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricEntry" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metricId" INTEGER NOT NULL,

    CONSTRAINT "MetricEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metric_userId_name_key" ON "Metric"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "MetricEntry_metricId_date_key" ON "MetricEntry"("metricId", "date");

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricEntry" ADD CONSTRAINT "MetricEntry_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
