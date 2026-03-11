import type { SajuEngineRawOutput } from "./engine/types";
import type {
  NormalizedSajuResult,
  Pillar,
  FiveElementKey,
  FiveElementSummary,
  DaewoonItem,
} from "./types";

function normalizePillar(
  raw: { stem?: string; branch?: string } | null | undefined
): Pillar | null {
  if (!raw || !raw.stem || !raw.branch) return null;
  return {
    heavenlyStem: raw.stem,
    earthlyBranch: raw.branch,
  };
}

export function normalizeSaju(
  raw: SajuEngineRawOutput,
  missingTime: boolean
): NormalizedSajuResult {
  const data = raw.data as Record<string, unknown>;

  const pillarsRaw = (data.pillars ?? {}) as Record<
    string,
    { stem?: string; branch?: string } | null
  >;

  const fiveElementsRaw = (data.fiveElements ?? {}) as Record<string, number>;
  const fiveElements: FiveElementSummary[] = (
    ["wood", "fire", "earth", "metal", "water"] as FiveElementKey[]
  ).map((element) => ({
    element,
    value: fiveElementsRaw[element] ?? 0,
  }));

  const daewoonRaw = (data.daewoon ?? []) as Array<{
    order: number;
    stem: string;
    branch: string;
    startAge: number;
    startYear: number;
    isCurrent: boolean;
  }>;

  const daewoon: DaewoonItem[] = daewoonRaw.map((d) => ({
    order: d.order,
    label: `${d.stem}${d.branch}`,
    startAge: d.startAge ?? null,
    startYear: d.startYear ?? null,
    isCurrent: d.isCurrent ?? false,
  }));

  return {
    pillars: {
      year: normalizePillar(pillarsRaw.year),
      month: normalizePillar(pillarsRaw.month),
      day: normalizePillar(pillarsRaw.day),
      hour: missingTime ? null : normalizePillar(pillarsRaw.hour),
    },
    dayMaster: (data.dayMaster as string) ?? null,
    fiveElements,
    keyRelations: [],
    daewoon,
    missingTime,
  };
}
