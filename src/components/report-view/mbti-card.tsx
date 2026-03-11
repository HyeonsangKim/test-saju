import { SectionCard } from "@/components/common/section-card";
import { Brain } from "lucide-react";

interface MbtiCardProps {
  mbti: string;
}

export function MbtiCard({ mbti }: MbtiCardProps) {
  return (
    <SectionCard title="MBTI">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
          <Brain className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <p className="text-2xl font-semibold">{mbti}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            사주-MBTI 교차 해석은 추후 버전에서 확장됩니다.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
