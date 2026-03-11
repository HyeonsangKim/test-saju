import type { SajuEngineInput, SajuEngineRawOutput } from "./engine/types";
import { mockSajuAdapter } from "./engine/mock.adapter";
import type { ReportCreateInput } from "./types";

const adapter = mockSajuAdapter;

export function buildEngineInput(input: ReportCreateInput): SajuEngineInput {
  const [y, m, d] = input.birthDate.split("-").map(Number);
  return {
    birthYear: y,
    birthMonth: m,
    birthDay: d,
    birthHour: input.birthHour ?? null,
    birthMinute: input.birthMinute ?? null,
    sexForCalculation: input.sexForCalculation,
    timezone: input.timezone,
  };
}

export async function calculateSaju(
  input: ReportCreateInput
): Promise<SajuEngineRawOutput> {
  const engineInput = buildEngineInput(input);
  return adapter.calculate(engineInput);
}

export function getEngineName(): string {
  return adapter.name;
}
