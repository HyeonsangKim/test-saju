import { SectionCard } from "@/components/common/section-card";
import type { MockReportBlock } from "@/lib/saju/types";

interface MockReportCardProps {
  blocks: MockReportBlock[];
}

export function MockReportCard({ blocks }: MockReportCardProps) {
  if (blocks.length === 0) return null;

  return (
    <SectionCard title="분석 리포트" description="계산 결과 기반 요약">
      <div className="space-y-5">
        {blocks.map((block) => (
          <div key={block.key} className="space-y-1.5">
            <h4 className="text-sm font-semibold text-foreground">
              {block.title}
            </h4>
            <p className="text-sm leading-6 text-muted-foreground">
              {block.body}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
