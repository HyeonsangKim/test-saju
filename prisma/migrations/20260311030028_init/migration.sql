-- CreateTable
CREATE TABLE "ReportRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sexForCalculation" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "birthHour" INTEGER,
    "birthMinute" INTEGER,
    "mbti" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Seoul',
    "missingTime" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ReportResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "calculationStatus" TEXT NOT NULL,
    "engineName" TEXT NOT NULL,
    "rawEngineOutput" TEXT,
    "normalizedOutput" TEXT,
    "mockReport" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReportResult_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ReportRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportResult_publicId_key" ON "ReportResult"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportResult_requestId_key" ON "ReportResult"("requestId");
