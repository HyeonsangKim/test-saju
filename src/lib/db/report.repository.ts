import { prisma } from "./client";
import { nanoid } from "nanoid";

export interface CreateReportRequestData {
  name: string;
  sexForCalculation: string;
  birthDate: string;
  birthHour: number | null;
  birthMinute: number | null;
  mbti: string;
  timezone: string;
  missingTime: boolean;
}

export interface CreateReportResultData {
  requestId: string;
  calculationStatus: "success" | "failed";
  engineName: string;
  rawEngineOutput: string | null;
  normalizedOutput: string | null;
  mockReport: string | null;
  errorMessage: string | null;
}

export async function saveReportRequest(data: CreateReportRequestData) {
  return prisma.reportRequest.create({ data });
}

export async function saveReportResult(data: CreateReportResultData) {
  const publicId = nanoid(12);
  return prisma.reportResult.create({
    data: {
      ...data,
      publicId,
    },
  });
}

export async function getReportByPublicId(publicId: string) {
  return prisma.reportResult.findUnique({
    where: { publicId },
    include: { request: true },
  });
}

export async function deleteExpiredReports(cutoffDate: Date) {
  const expired = await prisma.reportResult.findMany({
    where: { createdAt: { lt: cutoffDate } },
    select: { requestId: true },
  });

  if (expired.length === 0) return 0;

  const requestIds = expired.map((r) => r.requestId);

  await prisma.reportResult.deleteMany({
    where: { requestId: { in: requestIds } },
  });

  await prisma.reportRequest.deleteMany({
    where: { id: { in: requestIds } },
  });

  return expired.length;
}
