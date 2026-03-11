import type {
  NormalizedSajuResult,
  MockReportBlock,
  ReportCreateInput,
  FIVE_ELEMENT_LABELS,
} from "@/lib/saju/types";
import { FIVE_ELEMENT_LABELS as LABELS } from "@/lib/saju/types";

export function buildMockReport(
  normalized: NormalizedSajuResult,
  input: ReportCreateInput
): MockReportBlock[] {
  const blocks: MockReportBlock[] = [];

  const pillarCount = Object.values(normalized.pillars).filter(Boolean).length;
  blocks.push({
    key: "overview",
    title: "한눈에 보기",
    body: `${input.name}님의 사주는 총 ${pillarCount}주로 구성되어 있습니다. ${
      normalized.missingTime
        ? "출생 시간이 입력되지 않아 시주 없이 3주 기준으로 분석합니다."
        : "연·월·일·시 4주 모두를 기반으로 분석합니다."
    }`,
  });

  if (normalized.dayMaster) {
    blocks.push({
      key: "dayMaster",
      title: "일간 (Day Master)",
      body: `당신의 일간은 '${normalized.dayMaster}'입니다. 일간은 사주에서 나 자신을 대표하는 핵심 글자로, 성격과 기질의 기본 방향을 나타냅니다.`,
    });
  }

  const sorted = [...normalized.fiveElements].sort((a, b) => b.value - a.value);
  const topElement = sorted[0];
  if (topElement) {
    const topLabel = LABELS[topElement.element as keyof typeof LABELS];
    blocks.push({
      key: "fiveElements",
      title: "오행 분포",
      body: `오행 분포에서는 ${topLabel} 기운이 상대적으로 두드러집니다. 오행의 균형은 개인의 성향과 에너지 흐름을 이해하는 데 참고할 수 있습니다.`,
    });
  }

  if (normalized.daewoon.length > 0) {
    const current = normalized.daewoon.find((d) => d.isCurrent);
    blocks.push({
      key: "daewoon",
      title: "대운 흐름",
      body: current
        ? `현재 대운은 '${current.label}'이며, ${current.startAge}세부터 시작된 흐름입니다. 대운은 약 10년 단위로 바뀌며 삶의 큰 흐름을 나타냅니다.`
        : "대운 정보가 계산되었습니다. 대운은 약 10년 단위로 바뀌며 삶의 큰 흐름을 나타냅니다.",
    });
  }

  blocks.push({
    key: "mbti",
    title: "MBTI 참고",
    body: `입력하신 MBTI는 ${input.mbti}입니다. 현재 버전에서는 MBTI를 저장 및 표시하며, 사주와의 교차 해석은 추후 버전에서 확장됩니다.`,
  });

  if (normalized.missingTime) {
    blocks.push({
      key: "missingTime",
      title: "시간 미상 안내",
      body: "출생 시간이 입력되지 않아 시주(時柱) 관련 정보가 제한됩니다. 보다 정확한 결과를 위해 출생 시간을 확인 후 다시 시도해 보세요.",
    });
  }

  return blocks;
}
