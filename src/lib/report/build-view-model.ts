import type {
  ReportPageViewModel,
  NormalizedSajuResult,
  MockReportBlock,
  ReportCreateInput,
  FIVE_ELEMENT_LABELS,
} from "@/lib/saju/types";
import { FIVE_ELEMENT_LABELS as LABELS, STEM_HANJA, BRANCH_HANJA } from "@/lib/saju/types";
import { maskName, formatDateKorean, formatTimeLabel, formatCreatedAt } from "@/lib/utils/date";

interface BuildViewModelInput {
  publicId: string;
  input: ReportCreateInput;
  normalized: NormalizedSajuResult | null;
  mockReport: MockReportBlock[] | null;
  calculationStatus: "success" | "failed";
  errorMessage: string | null;
  createdAt: Date | string;
}

function formatPillar(
  pillar: { heavenlyStem: string; earthlyBranch: string } | null,
  labelName: string
): { stem: string; branch: string; label: string } | null {
  if (!pillar) return null;
  const stemHanja = STEM_HANJA[pillar.heavenlyStem] ?? "";
  const branchHanja = BRANCH_HANJA[pillar.earthlyBranch] ?? "";
  return {
    stem: `${pillar.heavenlyStem}(${stemHanja})`,
    branch: `${pillar.earthlyBranch}(${branchHanja})`,
    label: labelName,
  };
}

export function buildReportPageViewModel(
  data: BuildViewModelInput
): ReportPageViewModel {
  const { publicId, input, normalized, mockReport, calculationStatus, errorMessage, createdAt } =
    data;

  const maskedName = maskName(input.name);

  const fiveElements = normalized
    ? normalized.fiveElements.map((fe) => ({
        element: fe.element,
        value: fe.value,
        label: LABELS[fe.element as keyof typeof LABELS] ?? fe.element,
      }))
    : [];

  const daewoon = normalized
    ? normalized.daewoon.map((d) => ({
        order: d.order,
        label: d.label,
        startAge: d.startAge,
        isCurrent: d.isCurrent,
      }))
    : [];

  return {
    reportPublicId: publicId,
    title: `${maskedName}님의 사주 결과`,
    createdAtLabel: formatCreatedAt(createdAt),
    missingTime: normalized?.missingTime ?? (input.birthHour === null || input.birthHour === undefined),
    inputSummary: {
      name: maskedName,
      sexForCalculation: input.sexForCalculation === "male" ? "남성" : "여성",
      birthDate: formatDateKorean(input.birthDate),
      birthTimeLabel: formatTimeLabel(input.birthHour, input.birthMinute),
      mbti: input.mbti,
    },
    pillars: normalized
      ? {
          year: formatPillar(normalized.pillars.year, "연주"),
          month: formatPillar(normalized.pillars.month, "월주"),
          day: formatPillar(normalized.pillars.day, "일주"),
          hour: formatPillar(normalized.pillars.hour, "시주"),
        }
      : { year: null, month: null, day: null, hour: null },
    dayMaster: normalized?.dayMaster ?? null,
    fiveElements,
    daewoon,
    mockReport: mockReport ?? [],
    status: calculationStatus,
    errorMessage,
  };
}
