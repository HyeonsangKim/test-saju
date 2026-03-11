import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReportViewModel } from "@/lib/report/get-report-by-public-id";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { ReportHeader } from "@/components/report-view/report-header";
import { InputSummaryCard } from "@/components/report-view/input-summary-card";
import { PillarsCard } from "@/components/report-view/pillars-card";
import { DayMasterCard } from "@/components/report-view/day-master-card";
import { FiveElementsCard } from "@/components/report-view/five-elements-card";
import { DaewoonCard } from "@/components/report-view/daewoon-card";
import { MbtiCard } from "@/components/report-view/mbti-card";
import { MockReportCard } from "@/components/report-view/mock-report-card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "사주 결과 - 사주TI",
  robots: { index: false, follow: false },
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const viewModel = await getReportViewModel(id);

  if (!viewModel) {
    notFound();
  }

  if (viewModel.status === "failed") {
    return (
      <div className="min-h-screen bg-background py-8 md:py-12">
        <PageContainer maxWidth="3xl">
          <ReportHeader
            title={viewModel.title}
            createdAtLabel={viewModel.createdAtLabel}
            missingTime={viewModel.missingTime}
            status="failed"
          />
          <div className="mt-8">
            <ErrorState
              title="계산 실패"
              message={
                viewModel.errorMessage ??
                "결과 생성 중 오류가 발생했습니다. 다시 시도해 주세요."
              }
            />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <PageContainer maxWidth="3xl">
        <div className="space-y-6">
          <ReportHeader
            title={viewModel.title}
            createdAtLabel={viewModel.createdAtLabel}
            missingTime={viewModel.missingTime}
            status={viewModel.status}
          />

          <InputSummaryCard {...viewModel.inputSummary} />

          <PillarsCard
            pillars={viewModel.pillars}
            missingTime={viewModel.missingTime}
          />

          <DayMasterCard dayMaster={viewModel.dayMaster} />

          <FiveElementsCard fiveElements={viewModel.fiveElements} />

          <DaewoonCard daewoon={viewModel.daewoon} />

          <MbtiCard mbti={viewModel.inputSummary.mbti} />

          <MockReportCard blocks={viewModel.mockReport} />

          <div className="text-center pt-4 pb-8">
            <Link
              href="/report/new"
              className="inline-flex items-center justify-center gap-2 h-11 md:h-12 rounded-full px-6 md:px-8 font-medium text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              다시 해보기
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
