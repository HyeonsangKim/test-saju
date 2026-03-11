export type SexForCalculation = "male" | "female";

export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export const MBTI_TYPES: MBTIType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

export interface ReportCreateInput {
  name: string;
  sexForCalculation: SexForCalculation;
  birthDate: string;
  birthHour?: number | null;
  birthMinute?: number | null;
  mbti: MBTIType;
  timezone: string;
}

export interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
  label?: string;
}

export type FiveElementKey = "wood" | "fire" | "earth" | "metal" | "water";

export interface FiveElementSummary {
  element: FiveElementKey;
  value: number;
}

export interface DaewoonItem {
  order: number;
  label: string;
  startAge?: number | null;
  startYear?: number | null;
  isCurrent?: boolean;
}

export interface NormalizedSajuResult {
  pillars: {
    year: Pillar | null;
    month: Pillar | null;
    day: Pillar | null;
    hour: Pillar | null;
  };
  dayMaster: string | null;
  fiveElements: FiveElementSummary[];
  keyRelations: string[];
  daewoon: DaewoonItem[];
  missingTime: boolean;
}

export interface MockReportBlock {
  key:
    | "overview"
    | "dayMaster"
    | "fiveElements"
    | "daewoon"
    | "mbti"
    | "missingTime";
  title: string;
  body: string;
}

export type CalculationStatus = "success" | "failed";

export interface ReportRecord {
  requestId: string;
  resultId: string;
  publicId: string;
  input: ReportCreateInput;
  calculationStatus: CalculationStatus;
  missingTime: boolean;
  engineName: string;
  rawEngineOutput: string | null;
  normalizedOutput: string | null;
  mockReport: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportPageViewModel {
  reportPublicId: string;
  title: string;
  createdAtLabel: string;
  missingTime: boolean;
  inputSummary: {
    name: string;
    sexForCalculation: string;
    birthDate: string;
    birthTimeLabel: string;
    mbti: string;
  };
  pillars: {
    year: { stem: string; branch: string; label: string } | null;
    month: { stem: string; branch: string; label: string } | null;
    day: { stem: string; branch: string; label: string } | null;
    hour: { stem: string; branch: string; label: string } | null;
  };
  dayMaster: string | null;
  fiveElements: {
    element: string;
    value: number;
    label: string;
  }[];
  daewoon: {
    order: number;
    label: string;
    startAge?: number | null;
    isCurrent?: boolean;
  }[];
  mockReport: MockReportBlock[];
  status: "success" | "failed";
  errorMessage?: string | null;
}

export const FIVE_ELEMENT_LABELS: Record<FiveElementKey, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};

export const HEAVENLY_STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;
export const EARTHLY_BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;

export const STEM_HANJA: Record<string, string> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
  기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};

export const BRANCH_HANJA: Record<string, string> = {
  자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳",
  오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥",
};
