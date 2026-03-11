import { z } from "zod";
import { MBTI_TYPES } from "@/lib/saju/types";

export const reportRequestSchema = z
  .object({
    name: z
      .string({ error: "이름을 입력해 주세요." })
      .transform((v) => v.trim())
      .pipe(z.string().min(1, "이름을 입력해 주세요.")),
    sexForCalculation: z.enum(["male", "female"], {
      error: "성별(계산용)을 선택해 주세요.",
    }),
    birthDate: z
      .string({ error: "생년월일을 입력해 주세요." })
      .min(1, "생년월일을 입력해 주세요.")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "유효한 생년월일을 입력해 주세요.")
      .refine((val) => {
        const d = new Date(val);
        return !isNaN(d.getTime());
      }, "유효한 생년월일을 입력해 주세요.")
      .refine((val) => {
        return new Date(val) <= new Date();
      }, "미래 날짜는 입력할 수 없습니다.")
      .refine((val) => {
        return val >= "1900-01-01";
      }, "1900년 이후 날짜만 입력 가능합니다."),
    birthHour: z
      .union([z.number(), z.string(), z.null()])
      .optional()
      .transform((v) => {
        if (v === null || v === undefined || v === "") return null;
        return typeof v === "string" ? parseInt(v, 10) : v;
      })
      .pipe(
        z
          .number()
          .int()
          .min(0, "출생 시는 0~23 사이여야 합니다.")
          .max(23, "출생 시는 0~23 사이여야 합니다.")
          .nullable()
      ),
    birthMinute: z
      .union([z.number(), z.string(), z.null()])
      .optional()
      .transform((v) => {
        if (v === null || v === undefined || v === "") return null;
        return typeof v === "string" ? parseInt(v, 10) : v;
      })
      .pipe(
        z
          .number()
          .int()
          .min(0, "출생 분은 0~59 사이여야 합니다.")
          .max(59, "출생 분은 0~59 사이여야 합니다.")
          .nullable()
      ),
    mbti: z.enum(MBTI_TYPES as [string, ...string[]], {
      error: "MBTI를 선택해 주세요.",
    }),
  })
  .refine(
    (data) => {
      if (data.birthHour === null && data.birthMinute !== null) {
        return false;
      }
      return true;
    },
    {
      message: "출생 분만 단독으로 입력할 수 없습니다.",
      path: ["birthMinute"],
    }
  )
  .transform((data) => ({
    ...data,
    birthMinute:
      data.birthHour !== null && data.birthMinute === null
        ? 0
        : data.birthMinute,
  }));

export type ReportRequestFormData = z.input<typeof reportRequestSchema>;
export type ReportRequestValidated = z.output<typeof reportRequestSchema>;
