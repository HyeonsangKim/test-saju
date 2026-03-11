import { NextRequest, NextResponse } from "next/server";
import { reportRequestSchema } from "@/lib/validation/report-request.schema";
import { createReport } from "@/lib/report/create-report";
import type { ReportCreationResponse } from "@/lib/utils/errors";
import type { ReportCreateInput } from "@/lib/saju/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = reportRequestSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }

      const response: ReportCreationResponse = {
        type: "validation_error",
        errors: fieldErrors,
      };

      return NextResponse.json(response, { status: 422 });
    }

    const input = {
      ...parsed.data,
      timezone: "Asia/Seoul",
    } as ReportCreateInput;

    const result = await createReport(input);

    const response: ReportCreationResponse = {
      type: "completed",
      publicId: result.publicId,
      status: result.status,
      errorMessage: result.errorMessage,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "";
    console.error("[POST /api/report] Unexpected error:", errMsg);
    console.error("[POST /api/report] Stack:", stack);

    const response: ReportCreationResponse = {
      type: "completed",
      publicId: "",
      status: "failed",
      errorMessage: "결과 생성 중 오류가 발생했습니다. 다시 시도해 주세요.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
