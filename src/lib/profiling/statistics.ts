import type { ColumnStatistics, ColumnDataType } from "@/types/dataset.types";
import { isNonMissingValue } from "./typeInference";

export interface NumericStats {
  min: number;
  max: number;
  sum: number;
  mean: number;
  median?: number;
  stdDev?: number;
  count: number;
}

export interface TextStats {
  minLength: number;
  maxLength: number;
  avgLength: number;
  emptyStrings: number;
}

export interface BooleanStats {
  trueCount: number;
  falseCount: number;
}

export interface DateStats {
  earliestDate: Date | null;
  latestDate: Date | null;
}

export function calculateNumericStats(values: string[]): NumericStats {
  const numbers: number[] = [];
  for (const v of values) {
    if (isNonMissingValue(v)) {
      const n = parseFloat(v.trim());
      if (!isNaN(n)) {
        numbers.push(n);
      }
    }
  }

  if (numbers.length === 0) {
    return { min: 0, max: 0, sum: 0, mean: 0, count: 0 };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / numbers.length;

  let median: number | undefined;
  const mid = Math.floor(numbers.length / 2);
  if (numbers.length % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  let stdDev: number | undefined;
  if (numbers.length > 1) {
    const variance =
      numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
      (numbers.length - 1);
    stdDev = Math.sqrt(variance);
  }

  return { min, max, sum, mean, median, stdDev, count: numbers.length };
}

export function calculateTextStats(values: string[]): TextStats {
  const nonMissing = values.filter((v) => isNonMissingValue(v));
  const lengths = nonMissing.map((v) => v.length);
  const emptyStrings = nonMissing.filter((v) => v.trim() === "").length;

  if (lengths.length === 0) {
    return { minLength: 0, maxLength: 0, avgLength: 0, emptyStrings: 0 };
  }

  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  return { minLength, maxLength, avgLength, emptyStrings };
}

export function calculateBooleanStats(values: string[]): BooleanStats {
  let trueCount = 0;
  let falseCount = 0;

  for (const v of values) {
    if (!isNonMissingValue(v)) continue;
    const trimmed = v.trim().toLowerCase();
    if (trimmed === "true" || trimmed === "yes" || trimmed === "1" || trimmed === "t" || trimmed === "y") {
      trueCount++;
    } else if (trimmed === "false" || trimmed === "no" || trimmed === "0" || trimmed === "f" || trimmed === "n") {
      falseCount++;
    }
  }

  return { trueCount, falseCount };
}

export function calculateDateStats(values: string[]): DateStats {
  let earliest: Date | null = null;
  let latest: Date | null = null;

  for (const v of values) {
    if (!isNonMissingValue(v)) continue;
    const d = new Date(v.trim());
    if (!isNaN(d.getTime())) {
      if (!earliest || d < earliest) earliest = d;
      if (!latest || d > latest) latest = d;
    }
  }

  return { earliestDate: earliest, latestDate: latest };
}

export function buildColumnStatistics(
  dataType: ColumnDataType,
  values: string[]
): ColumnStatistics | undefined {
  switch (dataType) {
    case "integer":
    case "decimal":
      return calculateNumericStats(values) as ColumnStatistics;
    case "string":
      return calculateTextStats(values) as ColumnStatistics;
    case "boolean":
      return calculateBooleanStats(values) as ColumnStatistics;
    case "date":
    case "datetime":
      return calculateDateStats(values) as ColumnStatistics;
    default:
      return undefined;
  }
}
