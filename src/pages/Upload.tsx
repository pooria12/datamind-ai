import { useState } from "react";
import { useDataset } from "@hooks/useDataset";
import { DatasetUploader } from "@components/datasets/DatasetUploader";
import { useToast } from "@hooks/useToast";

export function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    dataset,
    progress,
    parsingResult,
    isProcessing,
    error,
    selectFile,
    processFile,
    clearDataset,
  } = useDataset();

  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    selectFile(file);
  };

  const handleProcess = () => {
    if (!selectedFile) return;
    processFile(selectedFile);
  };

  const handleRemove = async () => {
    setSelectedFile(null);
    await clearDataset();
    toast({
      title: "Dataset cleared",
      description: "The dataset has been removed from storage",
      variant: "info",
      duration: 3000,
    });
  };

  const handleReplace = () => {
    setSelectedFile(null);
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

  const selectedFileMeta =
    selectedFile && {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    };

  return (
    <DatasetUploader
      onFileSelect={handleFileSelect}
      onProcess={handleProcess}
      onRemove={handleRemove}
      onReplace={handleReplace}
      selectedFile={selectedFileMeta}
      processingStatus={processingStatus}
      progress={progress}
      error={error}
      parsingResult={parsingResultMapped}
      disabled={isProcessing}
    />
  );
}
