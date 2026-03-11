import { StatusBadge } from "@/components/common/status-badge";

interface ReportHeaderProps {
  title: string;
  createdAtLabel: string;
  missingTime: boolean;
  status: "success" | "failed";
}

export function ReportHeader({
  title,
  createdAtLabel,
  missingTime,
  status,
}: ReportHeaderProps) {
  return (
    <div className="text-center space-y-3">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">{createdAtLabel}</span>
        {missingTime && (
          <StatusBadge variant="missingTime">시간 미상 기준</StatusBadge>
        )}
        {status === "failed" && (
          <StatusBadge variant="failed">계산 실패</StatusBadge>
        )}
      </div>
    </div>
  );
}
