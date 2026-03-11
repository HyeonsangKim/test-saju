import { SectionCard } from "@/components/common/section-card";
import { User, Calendar, Clock, Brain } from "lucide-react";

interface InputSummaryCardProps {
  name: string;
  sexForCalculation: string;
  birthDate: string;
  birthTimeLabel: string;
  mbti: string;
}

export function InputSummaryCard({
  name,
  sexForCalculation,
  birthDate,
  birthTimeLabel,
  mbti,
}: InputSummaryCardProps) {
  const items = [
    { icon: User, label: "이름", value: name },
    { icon: User, label: "성별", value: sexForCalculation },
    { icon: Calendar, label: "생년월일", value: birthDate },
    { icon: Clock, label: "출생 시간", value: birthTimeLabel },
    { icon: Brain, label: "MBTI", value: mbti },
  ];

  return (
    <SectionCard title="입력 요약">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </div>
            <p className="text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
