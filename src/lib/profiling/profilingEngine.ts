import type {
  ColumnMetadata,
  DatasetProfile,
  ParsingError,
  MissingValuePolicy,
} from "@/types/dataset.types";
import { DEFAULT_MISSING_VALUE_POLICY } from "@/types/dataset.types";
import { inferColumnType } from "./typeInference";
import {
  calculateMissingValues,
  calculateDatasetCompleteness,
} from "./missingValues";
import { detectDuplicateRows } from "./duplicates";
import { buildColumnStatistics } from "./statistics";

export interface ProfileInput {
  headers: string[];
  rows: Array<Record<string, string>>;
  rowCount: number;
  columnCount: number;
  parsingErrors: ParsingError[];
  parsingWarnings: ParsingError[];
  policy?: MissingValuePolicy;
}

export function profileDataset(
  input: ProfileInput,
  datasetId: string
): DatasetProfile {
  const policy = input.policy ?? DEFAULT_MISSING_VALUE_POLICY;
  const { headers, rows, rowCount, columnCount, parsingErrors, parsingWarnings } = input;

  const columnMap = new Map<string, string[]>();
  for (const header of headers) {
    columnMap.set(header, []);
  }

  for (const row of rows) {
    for (const header of headers) {
      const values = columnMap.get(header);
      if (values !== undefined) {
        values.push(row[header] ?? "");
      }
    }
  }

  const columnMetadata: ColumnMetadata[] = [];
  let columnIndex = 0;

  for (const header of headers) {
    const values = columnMap.get(header) ?? [];
    const dataType = inferColumnType(values);
    const missingStats = calculateMissingValues(values, header, policy);
    const uniqueValues = new Set(values.filter((v) => v !== ""));
    const uniqueCount = uniqueValues.size;
    const statistics = buildColumnStatistics(dataType, values);

    columnMetadata.push({
      id: `col-${columnIndex}`,
      name: header,
      displayName: header,
      dataType,
      totalRecords: rowCount,
      nonEmptyCount: rowCount - missingStats.missingCount,
      missingCount: missingStats.missingCount,
      missingPercentage: missingStats.missingPercentage,
      uniqueCount,
      duplicateCount: rowCount - uniqueCount,
      statistics,
    });
    columnIndex++;
  }

  const duplicateStats = detectDuplicateRows(rows);
  const completeness = calculateDatasetCompleteness(columnMetadata, rowCount);

  const emptyCells = columnsMissingSum(columnMetadata);
  const nonEmptyCells = completeness.nonEmptyCells;
  const totalCells = completeness.totalCells;
  const completenessPercentage = completeness.completenessPercentage;

  const parsingWarningCount = parsingWarnings.filter((w) => w.recoverable).length;
  const parsingErrorCount = parsingErrors.filter((e) => !e.recoverable).length;

  return {
    datasetId,
    totalRecords: rowCount,
    totalColumns: columnCount,
    totalCells,
    emptyCells,
    nonEmptyCells,
    completenessPercentage,
    duplicateRecords: duplicateStats.totalDuplicateRecords,
    uniqueRecords: duplicateStats.uniqueRecords,
    duplicatePercentage: duplicateStats.duplicatePercentage,
    parsingWarningCount,
    parsingErrorCount,
    columnMetadata,
    processedAt: new Date().toISOString(),
  };
}

function columnsMissingSum(columns: ColumnMetadata[]): number {
  let sum = 0;
  for (const col of columns) {
    sum += col.missingCount;
  }
  return sum;
}

export function updateColumnMetadataFromRows(
  columns: ColumnMetadata[],
  rows: Array<Record<string, string>>,
  policy: MissingValuePolicy = DEFAULT_MISSING_VALUE_POLICY
): ColumnMetadata[] {
  return columns.map((col) => {
    const values = rows.map((r) => r[col.name] ?? "");
    const missingStats = calculateMissingValues(values, col.name, policy);
    const uniqueValues = new Set(values.filter((v) => v !== ""));
    const statistics = buildColumnStatistics(col.dataType, values);
    return {
      ...col,
      missingCount: missingStats.missingCount,
      missingPercentage: missingStats.missingPercentage,
      uniqueCount: uniqueValues.size,
      duplicateCount: values.length - uniqueValues.size,
      statistics,
    };
  });
}
