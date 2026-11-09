export type ColumnDataType =
  | "string"
  | "integer"
  | "decimal"
  | "boolean"
  | "date"
  | "datetime"
  | "empty"
  | "unknown";

export interface ColumnMetadata {
  id: string;
  name: string;
  displayName: string;
  dataType: ColumnDataType;
  totalRecords: number;
  nonEmptyCount: number;
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  duplicateCount: number;
  statistics?: ColumnStatistics;
}

export interface ColumnStatistics {
  min?: number | string | Date;
  max?: number | string | Date;
  sum?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  minLength?: number;
  maxLength?: number;
  avgLength?: number;
  trueCount?: number;
  falseCount?: number;
  earliestDate?: Date;
  latestDate?: Date;
}

export interface ParsingError {
  category: "structure" | "encoding" | "delimiter" | "row" | "quote";
  rowNumber: number;
  columnName?: string;
  columnIndex?: number;
  message: string;
  severity: "warning" | "error";
  recoverable: boolean;
}

export interface ParsingResult {
  headers: string[];
  rows: Array<Record<string, string>>;
  rowCount: number;
  columnCount: number;
  errors: ParsingError[];
  warnings: ParsingError[];
  delimiter: string;
  hasHeader: boolean;
  encoding: string;
  hasBom: boolean;
  truncated: boolean;
}

export interface DatasetProfile {
  datasetId: string;
  totalRecords: number;
  totalColumns: number;
  totalCells: number;
  emptyCells: number;
  nonEmptyCells: number;
  completenessPercentage: number;
  duplicateRecords: number;
  uniqueRecords: number;
  duplicatePercentage: number;
  parsingWarningCount: number;
  parsingErrorCount: number;
  columnMetadata: ColumnMetadata[];
  processedAt: string;
}

export interface DataQualityIssue {
  type: "missing_values" | "duplicate_records" | "parsing_warning" | "inconsistent_row_length" | "empty_column";
  columnId?: string;
  columnName?: string;
  affectedRecordCount: number;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

export interface DataQualityReport {
  datasetId: string;
  completenessScore: number;
  uniquenessScore: number;
  parsingValidityScore: number;
  issues: DataQualityIssue[];
}

export type DatasetProcessingStatus =
  | "idle"
  | "selected"
  | "validating"
  | "parsing"
  | "profiling"
  | "saving"
  | "ready"
  | "warning"
  | "error"
  | "cancelled";

export interface DatasetRecord {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
  lastProcessedAt?: string;
  recordCount: number;
  columnCount: number;
  columns: ColumnMetadata[];
  status: DatasetProcessingStatus;
  parsingWarnings: ParsingError[];
  parsingErrors: ParsingError[];
  profile?: DatasetProfile;
  qualityReport?: DataQualityReport;
  storageStatus: "pending" | "saved" | "failed";
  storageError?: string;
}

export interface StoredDataset {
  id: string;
  version: number;
  dataset: DatasetRecord;
  records: Array<Record<string, string>>;
  savedAt: string;
}

export const STORAGE_VERSION = 1;

export interface MissingValuePolicy {
  markers: string[];
  treatWhitespaceOnlyAsMissing: boolean;
  treatEmptyAsMissing: boolean;
}

export const DEFAULT_MISSING_VALUE_POLICY: MissingValuePolicy = {
  markers: ["null", "NULL", "N/A", "n/a", "NA", "na", "NaN", "nan", "-", "--"],
  treatWhitespaceOnlyAsMissing: true,
  treatEmptyAsMissing: true,
};

export interface ProcessingLimits {
  maxFileSizeBytes: number;
  maxRecords: number;
  maxColumns: number;
  chunkSize: number;
}

export const DEFAULT_PROCESSING_LIMITS: ProcessingLimits = {
  maxFileSizeBytes: 50 * 1024 * 1024,
  maxRecords: 100000,
  maxColumns: 1000,
  chunkSize: 10000,
};
