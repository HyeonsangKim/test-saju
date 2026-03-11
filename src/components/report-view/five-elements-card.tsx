import { SectionCard } from "@/components/common/section-card";

interface FiveElement {
  element: string;
  value: number;
  label: string;
}

interface FiveElementsCardProps {
  fiveElements: FiveElement[];
}

const ELEMENT_COLORS: Record<string, string> = {
  wood: "bg-green-500",
  fire: "bg-red-500",
  earth: "bg-yellow-600",
  metal: "bg-gray-400",
  water: "bg-blue-500",
};

export function FiveElementsCard({ fiveElements }: FiveElementsCardProps) {
  const maxVal = Math.max(...fiveElements.map((e) => e.value), 1);

  return (
    <SectionCard title="오행 분포" description="사주 천간 기준 오행 비중">
      <div className="space-y-3">
        {fiveElements.map((el) => (
          <div key={el.element} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{el.label}</span>
              <span className="text-muted-foreground">{el.value}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  ELEMENT_COLORS[el.element] ?? "bg-primary"
                }`}
                style={{ width: `${(el.value / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
