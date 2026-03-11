import { SectionCard } from "@/components/common/section-card";
import { Sparkles } from "lucide-react";

interface DayMasterCardProps {
  dayMaster: string | null;
}

export function DayMasterCard({ dayMaster }: DayMasterCardProps) {
  if (!dayMaster) return null;

  return (
    <SectionCard title="일간 (Day Master)">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-semibold">{dayMaster}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            사주에서 나 자신을 대표하는 핵심 글자
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
