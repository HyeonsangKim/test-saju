import { getReportByPublicId as getFromDb } from "@/lib/db/report.repository";
import { buildReportPageViewModel } from "./build-view-model";
import type {
  ReportPageViewModel,
  NormalizedSajuResult,
  MockReportBlock,
  ReportCreateInput,
} from "@/lib/saju/types";

export async function getReportViewModel(
  publicId: string
): Promise<ReportPageViewModel | null> {
  const record = await getFromDb(publicId);

  if (!record) return null;

  const input: ReportCreateInput = {
    name: record.request.name,
    sexForCalculation: record.request.sexForCalculation as "male" | "female",
    birthDate: record.request.birthDate,
    birthHour: record.request.birthHour,
    birthMinute: record.request.birthMinute,
    mbti: record.request.mbti as ReportCreateInput["mbti"],
    timezone: record.request.timezone,
  };

  let normalized: NormalizedSajuResult | null = null;
  if (record.normalizedOutput) {
    try {
      normalized = JSON.parse(record.normalizedOutput);
    } catch {
      normalized = null;
    }
  }

  let mockReport: MockReportBlock[] | null = null;
  if (record.mockReport) {
    try {
      mockReport = JSON.parse(record.mockReport);
    } catch {
      mockReport = null;
    }
  }

  return buildReportPageViewModel({
    publicId: record.publicId,
    input,
    normalized,
    mockReport,
    calculationStatus: record.calculationStatus as "success" | "failed",
    errorMessage: record.errorMessage,
    createdAt: record.createdAt,
  });
}
