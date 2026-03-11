"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface BirthDateFieldProps {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onDayChange: (v: string) => void;
  disabled?: boolean;
  error?: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
  String(currentYear - i)
);
const months = Array.from({ length: 12 }, (_, i) => String(i + 1));

function getDaysInMonth(year: string, month: string): string[] {
  if (!year || !month) return Array.from({ length: 31 }, (_, i) => String(i + 1));
  const d = new Date(Number(year), Number(month), 0).getDate();
  return Array.from({ length: d }, (_, i) => String(i + 1));
}

const selectClass = cn(
  "h-11 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-8 text-sm",
  "transition-colors outline-none",
  "focus:border-ring focus:ring-2 focus:ring-ring/30",
  "disabled:cursor-not-allowed disabled:opacity-50"
);

export function BirthDateField({
  birthYear,
  birthMonth,
  birthDay,
  onYearChange,
  onMonthChange,
  onDayChange,
  disabled,
  error,
}: BirthDateFieldProps) {
  const days = getDaysInMonth(birthYear, birthMonth);

  return (
    <div className="space-y-2">
      <Label>생년월일</Label>
      <div className="grid grid-cols-3 gap-2">
        {/* Year */}
        <div className="relative">
          <select
            value={birthYear}
            onChange={(e) => onYearChange(e.target.value)}
            disabled={disabled}
            className={cn(selectClass, !birthYear && "text-muted-foreground")}
          >
            <option value="">년</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>

        {/* Month */}
        <div className="relative">
          <select
            value={birthMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            disabled={disabled}
            className={cn(selectClass, !birthMonth && "text-muted-foreground")}
          >
            <option value="">월</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>

        {/* Day */}
        <div className="relative">
          <select
            value={birthDay}
            onChange={(e) => onDayChange(e.target.value)}
            disabled={disabled}
            className={cn(selectClass, !birthDay && "text-muted-foreground")}
          >
            <option value="">일</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
