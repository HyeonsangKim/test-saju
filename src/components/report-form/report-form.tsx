"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/common/section-card";
import { MbtiField } from "./mbti-field";
import type { MBTIType } from "@/lib/saju/types";
import type { ReportCreationResponse } from "@/lib/utils/errors";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "error";

export function ReportForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [sexForCalculation, setSexForCalculation] = useState<string>("");
  const [birthDate, setBirthDate] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");
  const [mbti, setMbti] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    setFieldErrors({});
    setServerError(null);

    try {
      const body = {
        name,
        sexForCalculation,
        birthDate,
        birthHour: birthHour === "" ? null : birthHour,
        birthMinute: birthMinute === "" ? null : birthMinute,
        mbti,
      };

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: ReportCreationResponse = await res.json();

      if (data.type === "validation_error") {
        setFieldErrors(data.errors);
        setFormState("error");
        return;
      }

      if (data.type === "completed") {
        if (data.publicId) {
          router.push(`/report/${data.publicId}`);
        } else {
          setServerError(
            data.errorMessage ?? "결과 생성 중 오류가 발생했습니다."
          );
          setFormState("error");
        }
        return;
      }
    } catch {
      setServerError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      setFormState("error");
    }
  }

  const isSubmitting = formState === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SectionCard>
        <div className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              disabled={isSubmitting}
            />
            {fieldErrors.name && (
              <p className="text-xs text-destructive" role="alert">
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <Label>성별 (계산용)</Label>
            <div className="flex gap-3">
              {[
                { value: "male", label: "남성" },
                { value: "female", label: "여성" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSexForCalculation(opt.value)}
                  disabled={isSubmitting}
                  className={cn(
                    "flex-1 h-11 rounded-xl text-sm font-medium transition-colors border",
                    sexForCalculation === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {fieldErrors.sexForCalculation && (
              <p className="text-xs text-destructive" role="alert">
                {fieldErrors.sexForCalculation}
              </p>
            )}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">생년월일</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="rounded-xl"
              max={new Date().toISOString().split("T")[0]}
              min="1900-01-01"
              disabled={isSubmitting}
            />
            {fieldErrors.birthDate && (
              <p className="text-xs text-destructive" role="alert">
                {fieldErrors.birthDate}
              </p>
            )}
          </div>

          {/* Birth Time */}
          <div className="space-y-2">
            <Label>출생 시간</Label>
            <p className="text-xs text-muted-foreground">
              모르면 비워두세요. 시만 입력하면 분은 00으로 보정됩니다.
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="시 (0-23)"
                  min={0}
                  max={23}
                  value={birthHour}
                  onChange={(e) => setBirthHour(e.target.value)}
                  className="rounded-xl"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="분 (0-59)"
                  min={0}
                  max={59}
                  value={birthMinute}
                  onChange={(e) => setBirthMinute(e.target.value)}
                  className="rounded-xl"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            {fieldErrors.birthHour && (
              <p className="text-xs text-destructive" role="alert">
                {fieldErrors.birthHour}
              </p>
            )}
            {fieldErrors.birthMinute && (
              <p className="text-xs text-destructive" role="alert">
                {fieldErrors.birthMinute}
              </p>
            )}
          </div>

          {/* MBTI */}
          <MbtiField
            value={mbti}
            onChange={(v) => setMbti(v)}
            error={fieldErrors.mbti}
          />
        </div>
      </SectionCard>

      {serverError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <PrimaryButton
        type="submit"
        loading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "생성 중..." : "사주 결과 보기"}
      </PrimaryButton>

      <p className="text-xs text-center text-muted-foreground px-2">
        결과 URL을 아는 사람은 결과를 열람할 수 있으며, 결과는 30일 후 자동
        삭제됩니다.
      </p>
    </form>
  );
}
