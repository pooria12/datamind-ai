import { useState } from "react";
import { useDataset } from "@hooks/useDataset";
import { DatasetUploader } from "@components/datasets/DatasetUploader";
import { useToast } from "@hooks/useToast";

export function Upload() {
  const [selectedFileObj, setSelectedFileObj] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);

  const {
    dataset,
    progress,
    parsingResult,
    isProcessing,
    error,
    processFile,
    clearDataset,
  } = useDataset();

  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFileObj({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const handleProcess = (file: File) => {
    processFile(file);
  };

  const handleRemove = async () => {
    setSelectedFileObj(null);
    await clearDataset();
    toast({
      title: "Dataset cleared",
      description: "The dataset has been removed from storage",
      variant: "info",
      duration: 3000,
    });
  };

  const handleReplace = () => {
    setSelectedFileObj(null);
  };

  const processingStatus = dataset ? dataset.status : "idle";
  const parsingResultMapped =
    parsingResult && {
      headers: parsingResult.headers,
      rows: parsingResult.rows,
      rowCount: parsingResult.rowCount,
      columnCount: parsingResult.columnCount,
      errors: parsingResult.errors.map((e) => ({
        message: e.message,
        severity: e.severity,
        rowNumber: e.rowNumber,
      })),
      warnings: parsingResult.warnings.map((w) => ({
        message: w.message,
        severity: w.severity,
        rowNumber: w.rowNumber,
      })),
      delimiter: parsingResult.delimiter,
      truncated: parsingResult.truncated,
    };

  return (
    <DatasetUploader
      onFileSelect={handleFileSelect}
      onProcess={handleProcess}
      onRemove={handleRemove}
      onReplace={handleReplace}
      selectedFile={selectedFileObj}
      processingStatus={processingStatus}
      progress={progress}
      error={error}
      parsingResult={parsingResultMapped}
      disabled={isProcessing}
    />
  );
}
