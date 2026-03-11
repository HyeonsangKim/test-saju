import { SectionCard } from "@/components/common/section-card";
import { cn } from "@/lib/utils";

interface DaewoonItem {
  order: number;
  label: string;
  startAge?: number | null;
  isCurrent?: boolean;
}

interface DaewoonCardProps {
  daewoon: DaewoonItem[];
}

export function DaewoonCard({ daewoon }: DaewoonCardProps) {
  if (daewoon.length === 0) return null;

  return (
    <SectionCard
      title="대운"
      description="약 10년 단위로 변화하는 인생의 큰 흐름"
    >
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {daewoon.map((d) => (
          <div
            key={d.order}
            className={cn(
              "flex flex-col items-center rounded-xl border p-2 text-center",
              d.isCurrent
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20"
            )}
          >
            <span className="text-xs text-muted-foreground mb-1">
              {d.startAge != null ? `${d.startAge}세` : ""}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                d.isCurrent && "text-primary"
              )}
            >
              {d.label}
            </span>
            {d.isCurrent && (
              <span className="text-[10px] text-primary mt-0.5">현재</span>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
