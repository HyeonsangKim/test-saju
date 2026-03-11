import { LandingHero } from "@/components/marketing/landing-hero";
import { FeatureCards } from "@/components/marketing/feature-cards";

export default function HomePage() {
  return (
    <main>
      <LandingHero />
      <FeatureCards />
      <footer className="py-8 text-center text-xs text-muted-foreground">
        <p>
          본 서비스는 참고용 결과를 제공하며, 전문적인 상담을 대체하지 않습니다.
        </p>
        <p className="mt-1">결과는 30일 후 자동 삭제됩니다.</p>
      </footer>
    </main>
  );
}
