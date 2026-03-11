import { PageContainer } from "@/components/common/page-container";
import { EmptyState } from "@/components/common/empty-state";

export default function ReportNotFound() {
  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <PageContainer maxWidth="3xl">
        <EmptyState />
      </PageContainer>
    </div>
  );
}
