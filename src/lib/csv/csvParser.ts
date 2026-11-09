import * as Papa from "papaparse";
import type { ParsingResult, ParsingError } from "@/types/dataset.types";

const COMMON_DELIMITERS = [",", ";", "\t", "|"];

export interface FileValidationOptions {
  allowedExtensions: string[];
  maxFileSizeBytes: number;
}

export const DEFAULT_VALIDATION_OPTIONS: FileValidationOptions = {
  allowedExtensions: [".csv"],
  maxFileSizeBytes: 50 * 1024 * 1024,
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface ParseOptions {
  delimiter?: string;
  hasHeader?: boolean;
  skipEmptyLines?: boolean;
  maxRecords?: number;
  chunkSize?: number;
  dynamicTyping?: boolean;
  encoding?: string;
}

export const DEFAULT_PARSE_OPTIONS: ParseOptions = {
  skipEmptyLines: true,
  dynamicTyping: false,
  chunkSize: 10000,
};

/**
 * Detects the most likely delimiter by sampling the first N lines.
 */
export function detectDelimiter(content: string): string {
  const lines = content.split(/\r?\n/).slice(0, 50);
  let bestDelimiter = ",";
  let bestScore = -1;

  for (const delim of COMMON_DELIMITERS) {
    let score = 0;
    let consistentCount = 0;

    for (const line of lines) {
      if (!line.trim()) continue;
      const count = countDelimiterOutsideQuotes(line, delim);
      if (count > 0) {
        score += count;
        consistentCount++;
      }
    }

    if (consistentCount > 0 && score > bestScore) {
      bestScore = score;
      bestDelimiter = delim;
    }
  }

  return bestDelimiter;
}

function countDelimiterOutsideQuotes(line: string, delim: string): number {
  let count = 0;
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (char === delim && !inQuotes) {
      count++;
    }
    i++;
  }

  return count;
}

/**
 * Strips UTF-8 BOM if present.
 */
export function stripBom(content: string): { content: string; hasBom: boolean } {
  if (content.charCodeAt(0) === 0xfeff) {
    return { content: content.slice(1), hasBom: true };
  }
  return { content, hasBom: false };
}

/**
 * Validates a File object before parsing.
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = DEFAULT_VALIDATION_OPTIONS
): ValidationResult {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();
  if (!options.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file type "${extension}". Only CSV files are allowed.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: "The file is empty (0 bytes)" };
  }

  if (file.size > options.maxFileSizeBytes) {
    const maxMB = (options.maxFileSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File exceeds maximum size of ${maxMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Parses a CSV file using Papa Parse with custom error handling.
 */
export async function parseCsvFile(
  file: File,
  options: ParseOptions = {}
): Promise<ParsingResult> {
  const config: ParseOptions = {
    ...DEFAULT_PARSE_OPTIONS,
    ...options,
  };

  return new Promise<ParsingResult>((resolve) => {
    const errors: ParsingError[] = [];
    const warnings: ParsingError[] = [];
    let delimiter = config.delimiter || "";
    let hasHeader = config.hasHeader !== undefined ? config.hasHeader : true;
    let hasBom = false;
    let encoding = "utf-8";

    const parseLocal = Papa.parse as unknown as (file: File, config: Record<string, unknown>) => void;
    parseLocal(file, {
      header: hasHeader,
      skipEmptyLines: config.skipEmptyLines,
      dynamicTyping: false,
      delimiter: config.delimiter,
      preview: config.maxRecords,
      chunkSize: config.chunkSize,
      encoding: config.encoding,
      transformHeader: (header: string) => header.trim(),
      beforeFirstChunk: (chunk: string) => {
        const stripped = stripBom(chunk);
        if (stripped.hasBom) {
          hasBom = true;
          encoding = "utf-8-bom";
        }
        if (!delimiter) {
          delimiter = detectDelimiter(stripped.content);
        }
        return stripped.content;
      },
      error: (err: Papa.ParseError) => {
        errors.push({
          category: "structure",
          rowNumber: err.row ?? 0,
          columnName: undefined,
          columnIndex: undefined,
          message: err.message ?? "Unknown parsing error",
          severity: "error",
          recoverable: false,
        });
      },
      step: (results: Papa.ParseStepResult<Record<string, string>>) => {
        if (results.errors && results.errors.length > 0) {
          for (const err of results.errors) {
            errors.push({
              category: "row",
              rowNumber: err.row ?? 0,
              columnName: undefined,
              columnIndex: undefined,
              message: err.message ?? "Row parsing error",
              severity: "warning",
              recoverable: true,
            });
          }
        }
        const rowData = results.data as Record<string, string>;
        if (rowData) {
          const keys = Object.keys(rowData);
          const emptyValues = keys.filter((k) => rowData[k] === "" || rowData[k] == null).length;
            if (emptyValues > 0 && emptyValues === keys.length) {
              warnings.push({
                category: "row",
                rowNumber: 0,
                columnName: undefined,
                columnIndex: undefined,
                message: "Empty row detected",
                severity: "warning",
                recoverable: true,
              });
            }
          }
      },
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        const data = results.data ?? [];
        const meta = results.meta;

        if (delimiter && !config.delimiter) {
          delimiter = detectDelimiter(delimiter);
        }

        if (meta.fields && meta.fields.length > 0) {
          hasHeader = true;
        }

        const headers = meta.fields ?? [];
        const rowCount = data.length;
        const columnCount = headers.length;

        let truncated = false;
        if (config.maxRecords && rowCount >= config.maxRecords) {
          truncated = true;
        }

        resolve({
          headers,
          rows: data,
          rowCount,
          columnCount,
          errors,
          warnings,
          delimiter: delimiter || ",",
          hasHeader,
          encoding,
          hasBom,
          truncated,
        });
      },
    });
  });
}

/**
 * Parses CSV content from a string.
 */
export async function parseCsvContent(
  content: string,
  options: ParseOptions = {}
): Promise<ParsingResult> {
  const stripped = stripBom(content);
  hasBomGlobal = stripped.hasBom;
  encodingGlobal = stripped.hasBom ? "utf-8-bom" : "utf-8";

  const config: ParseOptions = {
    ...DEFAULT_PARSE_OPTIONS,
    ...options,
  };

  return new Promise<ParsingResult>((resolve) => {
    const errors: ParsingError[] = [];
    const warnings: ParsingError[] = [];
    const delimiter = config.delimiter || detectDelimiter(stripped.content);

    const parseString = Papa.parse as unknown as (input: string, config: Record<string, unknown>) => void;
    parseString(stripped.content, {
      header: config.hasHeader !== undefined ? config.hasHeader : true,
      skipEmptyLines: config.skipEmptyLines,
      dynamicTyping: false,
      delimiter,
      preview: config.maxRecords,
      transformHeader: (header: string) => header.trim(),
      error: (err: Papa.ParseError) => {
        errors.push({
          category: "structure",
          rowNumber: err.row ?? 0,
          columnName: undefined,
          columnIndex: undefined,
          message: err.message ?? "Unknown parsing error",
          severity: "error",
          recoverable: false,
        });
      },
      step: (results: Papa.ParseStepResult<Record<string, string>>) => {
        if (results.errors && results.errors.length > 0) {
          for (const err of results.errors) {
            warnings.push({
              category: "row",
              rowNumber: err.row ?? 0,
              columnName: undefined,
              columnIndex: undefined,
              message: err.message ?? "Row parsing error",
              severity: "warning",
              recoverable: true,
            });
          }
        }
      },
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        const data = results.data ?? [];
        const meta = results.meta;
        const headers = meta.fields ?? [];
        const rowCount = data.length;
        const columnCount = headers.length;

        let truncated = false;
        if (config.maxRecords && rowCount >= config.maxRecords) {
          truncated = true;
        }

        resolve({
          headers,
          rows: data,
          rowCount,
          columnCount,
          errors,
          warnings,
          delimiter,
          hasHeader: config.hasHeader !== undefined ? config.hasHeader : true,
          encoding: encodingGlobal,
          hasBom: hasBomGlobal,
          truncated,
        });
      },
    });
  });
}

let hasBomGlobal = false;
let encodingGlobal = "utf-8";
