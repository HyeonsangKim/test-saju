import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
}

export function ErrorState({
  title = "오류가 발생했습니다",
  message = "결과 생성 중 오류가 발생했습니다. 다시 시도해 주세요.",
  showRetry = true,
}: ErrorStateProps) {
  return (
    <div className="py-12 text-center space-y-6">
      <Alert variant="destructive" className="max-w-md mx-auto text-left">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      {showRetry && (
        <Link
          href="/report/new"
          className="inline-flex items-center justify-center gap-2 h-11 md:h-12 rounded-full px-6 md:px-8 font-medium text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          다시 해보기
        </Link>
      )}
    </div>
  );
}
