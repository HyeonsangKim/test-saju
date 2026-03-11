import { SectionCard } from "@/components/common/section-card";

interface PillarData {
  stem: string;
  branch: string;
  label: string;
}

interface PillarsCardProps {
  pillars: {
    year: PillarData | null;
    month: PillarData | null;
    day: PillarData | null;
    hour: PillarData | null;
  };
  missingTime: boolean;
}

function PillarColumn({ data }: { data: PillarData | null }) {
  if (!data) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border p-3 text-center">
        <span className="text-xs text-muted-foreground mb-1">시주</span>
        <span className="text-sm text-muted-foreground">정보 없음</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-muted/30 p-3 text-center">
      <span className="text-xs text-muted-foreground mb-2">{data.label}</span>
      <span className="text-lg font-semibold">{data.stem}</span>
      <span className="text-lg font-semibold mt-1">{data.branch}</span>
    </div>
  );
}

export function PillarsCard({ pillars, missingTime }: PillarsCardProps) {
  return (
    <SectionCard
      title="사주팔자"
      description={missingTime ? "시주 정보 없음 (출생 시간 미상)" : undefined}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <PillarColumn data={pillars.year} />
        <PillarColumn data={pillars.month} />
        <PillarColumn data={pillars.day} />
        {missingTime ? (
          <PillarColumn data={null} />
        ) : (
          <PillarColumn data={pillars.hour} />
        )}
      </div>
    </SectionCard>
  );
}
