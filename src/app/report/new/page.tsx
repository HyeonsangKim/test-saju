import type { Metadata } from "next";
import { PageContainer } from "@/components/common/page-container";
import { ReportForm } from "@/components/report-form/report-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "사주 결과 보기 - 사주TI",
  description: "이름, 생년월일시, MBTI를 입력하면 사주 계산 결과를 구조화해 보여드립니다.",
};

export default function ReportNewPage() {
  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <PageContainer maxWidth="xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            사주 결과 보기
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            아래 정보를 입력하면 사주 계산 결과를 확인할 수 있습니다.
          </p>
        </div>
        <ReportForm />
      </PageContainer>
    </div>
  );
}
