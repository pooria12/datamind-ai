import { useState, useCallback, useRef } from "react";
import {
  Upload as UploadIcon,
  FileText,
  Info,
  AlertCircle,
  X,
  CheckCircle,
  File,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { PageHeader } from "@components/common/PageHeader";
import { Badge } from "@components/ui/Badge";
import { Progress } from "@components/ui/Progress";
import { cn } from "@lib/utils";

interface DatasetUploaderProps {
  onFileSelect: (file: File) => void;
  onProcess: (file: File) => void;
  onRemove: () => void;
  onReplace: () => void;
  selectedFile: { name: string; size: number; type: string } | null;
  processingStatus: "idle" | "selected" | "validating" | "parsing" | "profiling" | "saving" | "ready" | "warning" | "error" | "cancelled";
  progress: number;
  error: string | null;
  parsingResult: {
    headers: string[];
    rows: Array<Record<string, string>>;
    rowCount: number;
    columnCount: number;
    errors: Array<{ message: string; severity: string; rowNumber: number }>;
    warnings: Array<{ message: string; severity: string; rowNumber: number }>;
    delimiter: string;
    truncated: boolean;
  } | null;
  disabled: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  idle: "Ready",
  validating: "Validating file",
  parsing: "Parsing CSV",
  profiling: "Profiling data",
  saving: "Saving to storage",
  ready: "Ready",
  warning: "Completed with warnings",
  error: "Error",
  cancelled: "Cancelled",
};

const STATUS_VARIANTS: Record<string, "default" | "success" | "warning" | "destructive" | "info"> = {
  idle: "default",
  validating: "info",
  parsing: "info",
  profiling: "info",
  saving: "info",
  ready: "success",
  warning: "warning",
  error: "destructive",
  cancelled: "default",
};

export function DatasetUploader({
  onFileSelect,
  onProcess,
  onRemove,
  onReplace,
  selectedFile,
  processingStatus,
  progress,
  error,
  parsingResult,
  disabled,
}: DatasetUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  const removeFile = useCallback(() => {
    onRemove();
  }, [onRemove]);

  const replaceFile = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
    onReplace();
  }, [onReplace]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Upload Dataset"
        description="Import CSV files to begin analyzing your data"
        badge="Phase 2"
        badgeVariant="info"
      />

      <Card className={dragActive ? "border-primary bg-primary/5" : ""}>
        <CardHeader>
          <CardTitle>Drag & Drop CSV File</CardTitle>
          <CardDescription>
            Drop your CSV file here or click to browse. Maximum file size: 50MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
              selectedFile ? "border-success bg-success/5" : ""
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
              disabled={disabled || !!selectedFile}
            />

            {!selectedFile ? (
              <>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <UploadIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 text-lg font-medium text-foreground">
                  {dragActive ? "Drop the file here" : "Drop CSV file here"}
                </p>
                <p className="mb-6 text-muted-foreground">or</p>
                <Button
                  variant="outline"
                  className="mb-4"
                  disabled={disabled}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <p className="text-sm text-muted-foreground">
                  CSV format only. File is processed locally in your browser.
                </p>
              </>
            ) : (
              <div className="text-left max-w-md mx-auto">
                <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium text-foreground truncate">
                        {selectedFile.name}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={removeFile} aria-label="Remove file">
                      <X className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={replaceFile}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Replace
                    </Button>
                  </div>
                </div>
                {error && (
                  <p className="mt-3 text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}
                {!error && (
                  <p className="mt-3 text-sm text-success">
                    File selected successfully. Ready to process.
                  </p>
                )}
                <Button
                  onClick={() => onProcess(selectedFile as File)}
                  disabled={disabled || processingStatus !== "idle" && processingStatus !== "selected"}
                  className="mt-4 w-full"
                >
                  {processingStatus === "parsing" || processingStatus === "profiling" || processingStatus === "saving" ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Process Dataset
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
            <CardDescription>Real-time progress of dataset ingestion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {STATUS_LABELS[processingStatus]}
                </span>
                <Badge variant={STATUS_VARIANTS[processingStatus]}>
                  {STATUS_LABELS[processingStatus]}
                </Badge>
              </div>
              <Progress value={progress} showLabel label="Processing progress" />
              {parsingResult && (
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="p-3 border border-border rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Rows</div>
                    <div className="font-medium text-foreground">
                      {parsingResult.rowCount.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 border border-border rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Columns</div>
                    <div className="font-medium text-foreground">
                      {parsingResult.columnCount}
                    </div>
                  </div>
                  <div className="p-3 border border-border rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Warnings</div>
                    <div className="font-medium text-warning">
                      {parsingResult?.warnings.length ?? 0}
                    </div>
                  </div>
                  <div className="p-3 border border-border rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Errors</div>
                    <div className="font-medium text-destructive">
                      {parsingResult?.errors.length ?? 0}
                    </div>
                  </div>
                </div>
              )}
              {(parsingResult?.errors.length ?? 0) > 0 && (
                <div className="mt-4 p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">
                        Parsing Errors
                      </p>
                      <ul className="text-sm text-destructive/80 mt-1 space-y-1 list-disc list-inside">
                        {parsingResult?.errors.slice(0, 5).map((err, i) => (
                          <li key={i}>{err.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {processingStatus === "ready" || processingStatus === "warning" ? (
                <div className="mt-4 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Dataset processed successfully. Navigate to Data Preview to view records.
                  </span>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>CSV Format Requirements</CardTitle>
          <CardDescription>Ensure your data meets these requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Header row required</p>
                <p className="text-sm text-muted-foreground">
                  First row must contain column names
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Consistent columns</p>
                <p className="text-sm text-muted-foreground">
                  All rows must have the same number of columns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">UTF-8 encoding</p>
                <p className="text-sm text-muted-foreground">
                  Files must be UTF-8 encoded
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Local processing</p>
                <p className="text-sm text-muted-foreground">
                  CSV parsing happens entirely in your browser. No data is uploaded.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
