export type ErrorCode =
  | "VALIDATION_ERROR"
  | "CALCULATION_ERROR"
  | "NOT_FOUND"
  | "UNKNOWN_ERROR";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export type ReportCreationValidationError = {
  type: "validation_error";
  errors: Record<string, string>;
};

export type ReportCreationCompleted = {
  type: "completed";
  publicId: string;
  status: "success" | "failed";
  errorMessage?: string | null;
};

export type ReportCreationResponse =
  | ReportCreationValidationError
  | ReportCreationCompleted;
