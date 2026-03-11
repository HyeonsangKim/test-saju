import type { ReportCreateInput } from "@/lib/saju/types";
import { calculateSaju, getEngineName } from "@/lib/saju/calculate";
import { normalizeSaju } from "@/lib/saju/normalize";
import { buildMockReport } from "./build-mock-report";
import {
  saveReportRequest,
  saveReportResult,
} from "@/lib/db/report.repository";

interface CreateReportResult {
  publicId: string;
  status: "success" | "failed";
  errorMessage?: string | null;
}

export async function createReport(
  input: ReportCreateInput
): Promise<CreateReportResult> {
  const missingTime = input.birthHour === null || input.birthHour === undefined;

  const request = await saveReportRequest({
    name: input.name,
    sexForCalculation: input.sexForCalculation,
    birthDate: input.birthDate,
    birthHour: input.birthHour ?? null,
    birthMinute: input.birthMinute ?? null,
    mbti: input.mbti,
    timezone: input.timezone,
    missingTime,
  });

  try {
    const rawOutput = await calculateSaju(input);
    const normalized = normalizeSaju(rawOutput, missingTime);
    const mockReport = buildMockReport(normalized, input);

    const result = await saveReportResult({
      requestId: request.id,
      calculationStatus: "success",
      engineName: getEngineName(),
      rawEngineOutput: JSON.stringify(rawOutput),
      normalizedOutput: JSON.stringify(normalized),
      mockReport: JSON.stringify(mockReport),
      errorMessage: null,
    });

    return { publicId: result.publicId, status: "success" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";

    const result = await saveReportResult({
      requestId: request.id,
      calculationStatus: "failed",
      engineName: getEngineName(),
      rawEngineOutput: null,
      normalizedOutput: null,
      mockReport: null,
      errorMessage,
    });

    console.error("[createReport] Calculation failed:", errorMessage);

    return {
      publicId: result.publicId,
      status: "failed",
      errorMessage: "결과 생성 중 오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
}
