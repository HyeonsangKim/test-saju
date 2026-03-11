import type {
  SajuEngineAdapter,
  SajuEngineInput,
  SajuEngineRawOutput,
} from "./types";
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from "../types";

function seededIndex(seed: number, length: number): number {
  return ((seed % length) + length) % length;
}

export const mockSajuAdapter: SajuEngineAdapter = {
  name: "mock-v1",

  async calculate(input: SajuEngineInput): Promise<SajuEngineRawOutput> {
    const { birthYear, birthMonth, birthDay, birthHour, sexForCalculation } =
      input;

    const seed = birthYear * 10000 + birthMonth * 100 + birthDay;

    const yearStemIdx = seededIndex(birthYear - 4, 10);
    const yearBranchIdx = seededIndex(birthYear - 4, 12);

    const monthSeed = seed + birthMonth;
    const monthStemIdx = seededIndex(monthSeed, 10);
    const monthBranchIdx = seededIndex(monthSeed, 12);

    const daySeed = seed;
    const dayStemIdx = seededIndex(daySeed, 10);
    const dayBranchIdx = seededIndex(daySeed, 12);

    let hourStem: string | null = null;
    let hourBranch: string | null = null;

    if (birthHour !== null) {
      const hourSeed = seed + birthHour;
      hourStem = HEAVENLY_STEMS[seededIndex(hourSeed, 10)];
      hourBranch = EARTHLY_BRANCHES[seededIndex(hourSeed, 12)];
    }

    const dayMaster = HEAVENLY_STEMS[dayStemIdx];

    const stemElementMap: Record<string, string> = {
      갑: "wood", 을: "wood",
      병: "fire", 정: "fire",
      무: "earth", 기: "earth",
      경: "metal", 신: "metal",
      임: "water", 계: "water",
    };

    const allStems = [
      HEAVENLY_STEMS[yearStemIdx],
      HEAVENLY_STEMS[monthStemIdx],
      HEAVENLY_STEMS[dayStemIdx],
      ...(hourStem ? [hourStem] : []),
    ];

    const elementCounts: Record<string, number> = {
      wood: 0, fire: 0, earth: 0, metal: 0, water: 0,
    };
    for (const s of allStems) {
      elementCounts[stemElementMap[s]] += 1;
    }

    const birthYearNum = birthYear;
    const isMale = sexForCalculation === "male";
    const daewoonDirection = isMale ? 1 : -1;
    const daewoon = Array.from({ length: 8 }, (_, i) => {
      const order = i + 1;
      const startAge = 2 + i * 10;
      const stemIdx = seededIndex(monthStemIdx + (order * daewoonDirection), 10);
      const branchIdx = seededIndex(monthBranchIdx + (order * daewoonDirection), 12);
      const currentAge = new Date().getFullYear() - birthYearNum;
      return {
        order,
        stem: HEAVENLY_STEMS[stemIdx],
        branch: EARTHLY_BRANCHES[branchIdx],
        startAge,
        startYear: birthYearNum + startAge,
        isCurrent:
          currentAge >= startAge && currentAge < startAge + 10,
      };
    });

    return {
      engineName: "mock-v1",
      data: {
        pillars: {
          year: {
            stem: HEAVENLY_STEMS[yearStemIdx],
            branch: EARTHLY_BRANCHES[yearBranchIdx],
          },
          month: {
            stem: HEAVENLY_STEMS[monthStemIdx],
            branch: EARTHLY_BRANCHES[monthBranchIdx],
          },
          day: {
            stem: HEAVENLY_STEMS[dayStemIdx],
            branch: EARTHLY_BRANCHES[dayBranchIdx],
          },
          hour:
            hourStem && hourBranch
              ? { stem: hourStem, branch: hourBranch }
              : null,
        },
        dayMaster,
        fiveElements: elementCounts,
        daewoon,
      },
    };
  },
};
