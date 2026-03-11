"use client";

import { cn } from "@/lib/utils";
import { MBTI_TYPES, type MBTIType } from "@/lib/saju/types";
import { Label } from "@/components/ui/label";

interface MbtiFieldProps {
  value: string;
  onChange: (value: MBTIType) => void;
  error?: string;
}

export function MbtiField({ value, onChange, error }: MbtiFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">MBTI</Label>
      <div className="grid grid-cols-4 gap-2">
        {MBTI_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "h-10 rounded-xl text-sm font-medium transition-colors border",
              value === type
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
          >
            {type}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
