-- CreateTable
CREATE TABLE "Mother" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "village" TEXT,
    "district" TEXT,
    "bloodGroup" TEXT,
    "gravida" INTEGER,
    "gestationalWeek" INTEGER,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "hbLevel" DOUBLE PRECISION,
    "systolicBP" DOUBLE PRECISION,
    "diastolicBP" DOUBLE PRECISION,
    "bloodSugar" DOUBLE PRECISION,
    "bodyTemp" DOUBLE PRECISION,
    "heartRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mother_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "highRiskProbability" DOUBLE PRECISION NOT NULL,
    "midRiskProbability" DOUBLE PRECISION NOT NULL,
    "lowRiskProbability" DOUBLE PRECISION NOT NULL,
    "modelVersion" TEXT NOT NULL DEFAULT 'RF-v0.1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RiskAssessment_motherId_idx" ON "RiskAssessment"("motherId");

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
