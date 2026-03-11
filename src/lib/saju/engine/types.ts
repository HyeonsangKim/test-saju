export interface SajuEngineInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null;
  birthMinute: number | null;
  sexForCalculation: "male" | "female";
  timezone: string;
}

export interface SajuEngineRawOutput {
  engineName: string;
  data: Record<string, unknown>;
}

export interface SajuEngineAdapter {
  name: string;
  calculate(input: SajuEngineInput): Promise<SajuEngineRawOutput>;
}
