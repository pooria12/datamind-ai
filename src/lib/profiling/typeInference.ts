import type { ColumnDataType, MissingValuePolicy } from "@/types/dataset.types";
import { DEFAULT_MISSING_VALUE_POLICY } from "@/types/dataset.types";

const INTEGER_REGEX = /^-?\d+$/;
const DECIMAL_REGEX = /^-?\d+\.?\d*$|^-?\.\d+$/;
const BOOLEAN_TRUE = new Set(["true", "false", "yes", "no", "1", "0", "t", "f", "y", "n"]);
const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/,
  /^\d{2}\/\d{2}\/\d{4}$/,
  /^\d{2}-\d{2}-\d{4}$/,
  /^\d{4}\/\d{2}\/\d{2}$/,
];

function isDateTimeString(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(value) ||
    /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}/.test(value)
  );
}

function parseDate(value: string): Date | null {
  const trimmed = value.trim();
  for (const pattern of DATE_PATTERNS) {
    if (pattern.test(trimmed)) {
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) {
        return d;
      }
    }
  }
  if (isDateTimeString(trimmed)) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d;
    }
  }
  return null;
}

export function isMissingValue(
  value: string | null | undefined,
  policy: MissingValuePolicy = DEFAULT_MISSING_VALUE_POLICY
): boolean {
  if (value == null) return policy.treatEmptyAsMissing;
  const trimmed = value.trim();
  if (trimmed === "") return policy.treatEmptyAsMissing;
  if (policy.treatWhitespaceOnlyAsMissing && /^\s*$/.test(value)) return true;
  return policy.markers.includes(trimmed);
}

export function isNonMissingValue(
  value: string | null | undefined,
  policy: MissingValuePolicy = DEFAULT_MISSING_VALUE_POLICY
): boolean {
  return !isMissingValue(value, policy);
}

function inferSingleType(values: string[]): ColumnDataType {
  if (values.length === 0) return "empty";

  let integerCount = 0;
  let decimalCount = 0;
  let booleanCount = 0;
  let dateCount = 0;
  let datetimeCount = 0;
  let textCount = 0;

  for (const value of values) {
    const trimmed = value.trim();
    if (INTEGER_REGEX.test(trimmed)) {
      integerCount++;
    } else if (DECIMAL_REGEX.test(trimmed)) {
      decimalCount++;
    } else if (BOOLEAN_TRUE.has(trimmed.toLowerCase())) {
      booleanCount++;
    } else {
      const d = parseDate(trimmed);
      if (d) {
        if (isDateTimeString(trimmed)) {
          datetimeCount++;
        } else {
          dateCount++;
        }
      } else {
        textCount++;
      }
    }
  }

  const total = values.length;
  const numericCount = integerCount + decimalCount;
  const temporalCount = dateCount + datetimeCount;

  if (numericCount === total) {
    return decimalCount > 0 ? "decimal" : "integer";
  }
  if (booleanCount === total) return "boolean";
  if (temporalCount === total) return datetimeCount > 0 ? "datetime" : "date";
  if (textCount === total) return "string";

  // Mixed types: choose the most common non-text type, else string
  if (numericCount > total / 2) return decimalCount > integerCount ? "decimal" : "integer";
  if (temporalCount > total / 2) return datetimeCount > dateCount ? "datetime" : "date";
  if (booleanCount > total / 2) return "boolean";
  return "string";
}

export function inferColumnType(values: string[]): ColumnDataType {
  const nonMissing = values.filter((v) => isNonMissingValue(v));
  if (nonMissing.length === 0) return "empty";
  return inferSingleType(nonMissing);
}
