import { Calendar, Sparkles, MoonStar } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "간편한 입력",
    description:
      "이름, 생년월일, MBTI만 입력하세요. 출생 시간을 몰라도 결과를 확인할 수 있습니다.",
  },
  {
    icon: Sparkles,
    title: "구조화된 결과",
    description:
      "사주팔자, 오행 분포, 대운 등 핵심 결과를 읽기 쉬운 카드 형태로 정리해 보여줍니다.",
  },
  {
    icon: MoonStar,
    title: "자기이해의 출발",
    description:
      "복잡한 용어 대신 명확한 구조로. 사주를 통한 자기이해의 첫걸음을 함께합니다.",
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="mb-3 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
