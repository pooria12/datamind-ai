import { useState, useCallback, useEffect } from "react";
import type {
  DatasetRecord,
  DatasetProcessingStatus,
  StoredDataset,
  ParsingResult,
  ProcessingLimits,
} from "@/types/dataset.types";
import {
  DEFAULT_PROCESSING_LIMITS,
} from "@/types/dataset.types";
import {
  validateFile,
  parseCsvFile,
  FileValidationOptions,
  DEFAULT_VALIDATION_OPTIONS,
} from "@/lib/csv/csvParser";
import {
  profileDataset,
  type ProfileInput,
} from "@/lib/profiling/profilingEngine";
import { generateQualityReport } from "@/lib/profiling/dataQuality";
import { datasetRepository } from "@/lib/storage/datasetRepository";
import { addToast } from "@/lib/toast-state";

function generateId(): string {
  return `ds-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export interface UseDatasetReturn {
  dataset: DatasetRecord | null;
  records: Array<Record<string, string>> | null;
  status: DatasetProcessingStatus;
  progress: number;
  parsingResult: ParsingResult | null;
  isProcessing: boolean;
  error: string | null;
  selectFile: (file: File) => Promise<void>;
  processFile: (file: File) => Promise<void>;
  clearDataset: () => Promise<void>;
  retry: () => Promise<void>;
  loadRecords: () => Promise<void>;
}

export function useDataset(
  limits: ProcessingLimits = DEFAULT_PROCESSING_LIMITS,
  validationOptions: FileValidationOptions = DEFAULT_VALIDATION_OPTIONS
): UseDatasetReturn {
  const [dataset, setDataset] = useState<DatasetRecord | null>(null);
  const [records, setRecords] = useState<Array<Record<string, string>> | null>(null);
  const [status, setStatus] = useState<DatasetProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [parsingResult, setParsingResult] = useState<ParsingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isProcessing =
    status === "parsing" ||
    status === "profiling" ||
    status === "saving";

  const resetState = useCallback(() => {
    setDataset(null);
    setRecords(null);
    setStatus("idle");
    setProgress(0);
    setParsingResult(null);
    setError(null);
  }, [setRecords]);

  const loadRecords = useCallback(async () => {
    if (!dataset?.id) return;
    try {
      const stored = await datasetRepository.get(dataset.id);
      if (stored) {
        setRecords(stored.records);
      }
    } catch {
      void 0;
    }
  }, [dataset, setRecords]);

  const selectFile = useCallback(
    async (file: File) => {
      const validation = validateFile(file, validationOptions);
      if (!validation.valid) {
        setError(validation.error ?? null);
        setStatus("error");
        addToast({
          title: "Validation failed",
          description: validation.error,
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      setStatus("selected");
      setProgress(0);
      setError(null);
      setParsingResult(null);
      setRecords(null);

      const newDataset: DatasetRecord = {
        id: generateId(),
        filename: file.name,
        fileSize: file.size,
        fileType: file.type || "text/csv",
        createdAt: new Date().toISOString(),
        recordCount: 0,
        columnCount: 0,
        columns: [],
        status: "selected",
        parsingWarnings: [],
        parsingErrors: [],
        storageStatus: "pending",
      };
      setDataset(newDataset);

      addToast({
        title: "File selected",
        description: file.name,
        variant: "success",
        duration: 3000,
      });
    },
    [validationOptions, setRecords]
  );

  const processFile = useCallback(
    async (file: File) => {
      const validation = validateFile(file, validationOptions);
      if (!validation.valid) {
        setError(validation.error ?? null);
        setStatus("error");
        return;
      }

      setStatus("validating");
      setProgress(10);

      try {
        setStatus("parsing");
        setProgress(30);

        const result = await parseCsvFile(file, {
          skipEmptyLines: true,
          maxRecords: limits.maxRecords,
          chunkSize: limits.chunkSize,
        });

        setParsingResult(result);
        setProgress(60);

        if (result.errors.length > 0) {
          setStatus("warning");
        }

        setStatus("profiling");
        setProgress(75);

        const profileInput: ProfileInput = {
          headers: result.headers,
          rows: result.rows,
          rowCount: result.rowCount,
          columnCount: result.columnCount,
          parsingErrors: result.errors,
          parsingWarnings: result.warnings,
        };

        const datasetId = dataset?.id || generateId();

        const profile = profileDataset(profileInput, datasetId);
        const qualityReport = generateQualityReport(profile);

        setProgress(90);

        setStatus("saving");

        const updatedDataset: DatasetRecord = {
          ...dataset,
          id: datasetId,
          filename: file.name,
          fileSize: file.size,
          fileType: file.type || "text/csv",
          createdAt: dataset?.createdAt || new Date().toISOString(),
          lastProcessedAt: new Date().toISOString(),
          recordCount: result.rowCount,
          columnCount: result.columnCount,
          columns: profile.columnMetadata,
          status: result.errors.length > 0 ? "warning" : "ready",
          parsingWarnings: result.warnings,
          parsingErrors: result.errors,
          profile,
          qualityReport,
          storageStatus: "pending",
        };

        setDataset(updatedDataset);
        setRecords(result.rows);

        const stored: StoredDataset = {
          id: updatedDataset.id,
          version: 1,
          dataset: updatedDataset,
          records: result.rows,
          savedAt: new Date().toISOString(),
        };

        try {
          await datasetRepository.save(stored);
          await datasetRepository.setActive(updatedDataset.id);
          setProgress(100);
          setStatus(updatedDataset.status);
          addToast({
            title: "Dataset processed",
            description: `${result.rowCount} rows, ${result.columnCount} columns`,
            variant: "success",
            duration: 4000,
          });
        } catch {
          void 0;
        }
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "Processing failed"
        );
        addToast({
          title: "Processing failed",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
          duration: 5000,
        });
      }
    },
    [validationOptions, limits, dataset]
  );

  const clearDataset = useCallback(async () => {
    if (dataset?.id) {
      try {
        await datasetRepository.delete(dataset.id);
      } catch {
        void 0;
      }
    }
    resetState();
  }, [dataset, resetState]);

  const retry = useCallback(async () => {
    setError("Please re-select the file to retry processing");
  }, []);

  useEffect(() => {
    const recoverActive = async () => {
      try {
        const active = await datasetRepository.getActive();
        if (active) {
          setDataset(active.dataset);
          setRecords(active.records);
          setStatus(active.dataset.status);
          setProgress(100);
        }
      } catch {
        void 0;
      }
    };
    try {
      recoverActive();
    } catch {
      void 0;
    }
  }, [setRecords]);

  return {
    dataset,
    records,
    status,
    progress,
    parsingResult,
    isProcessing,
    error,
    selectFile,
    processFile,
    clearDataset,
    retry,
    loadRecords,
  };
}
