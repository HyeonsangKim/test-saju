import { Search } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "결과를 찾을 수 없습니다",
  message = "요청하신 결과를 찾을 수 없습니다. 새로운 결과를 만들어 보세요.",
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center space-y-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Search className="w-5 h-5 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        {message}
      </p>
      <Link
        href="/report/new"
        className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity mt-4"
      >
        사주 결과 보기
      </Link>
    </div>
  );
}
