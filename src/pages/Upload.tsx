import { useState, useCallback, useRef } from 'react';
import {
  Upload as UploadIcon,
  FileText,
  Info,
  AlertCircle,
  X,
  CheckCircle,
  File,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageHeader } from '@components/common/PageHeader';
import { Badge } from '@components/ui/Badge';
import { useToast } from '@hooks/useToast';

interface SelectedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

export function Upload() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return 'Only CSV files are allowed';
    }
    if (file.size === 0) {
      return 'File appears to be empty';
    }
    if (file.size > 100 * 1024 * 1024) {
      return 'File size must be less than 100MB';
    }
    return null;
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      toast({ title: 'Invalid file', description: error, variant: 'destructive', duration: 5000 });
      return;
    }
    setFileError(null);
    setSelectedFile({
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'text/csv',
    });
    toast({ title: 'File selected', description: `${file.name} is ready for processing`, variant: 'success', duration: 3000 });
  }, [validateFile, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  const removeFile = useCallback(() => {
    const name = selectedFile?.name;
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (name) {
      toast({ title: 'File removed', description: `${name} was removed from the upload area`, variant: 'info', duration: 3000 });
    }
  }, [selectedFile, toast]);

  const replaceFile = useCallback(() => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

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
        badge="Phase 1"
        badgeVariant="info"
      />

      {/* Drop Zone */}
      <Card className={dragActive ? 'border-primary bg-primary/5' : ''}>
        <CardHeader>
          <CardTitle>Drag & Drop CSV File</CardTitle>
          <CardDescription>
            Drop your CSV file here or click to browse. Maximum file size: 100MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
              ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${selectedFile ? 'border-success bg-success/5' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
              disabled={!!selectedFile}
            />

            {!selectedFile ? (
              <>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <UploadIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 text-lg font-medium text-foreground">
                  {dragActive ? 'Drop the file here' : 'Drop CSV file here'}
                </p>
                <p className="mb-6 text-muted-foreground">or</p>
                <Button
                  variant="outline"
                  className="mb-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <p className="text-sm text-muted-foreground">
                  CSV format only. File selection works locally; processing will be implemented in Phase 2.
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
                      <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      aria-label="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={replaceFile}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Replace
                    </Button>
                  </div>
                </div>
                {fileError && (
                  <p className="mt-3 text-sm text-destructive" role="alert">
                    {fileError}
                  </p>
                )}
                {!fileError && (
                  <p className="mt-3 text-sm text-success">
                    File selected successfully. Dataset processing will be available in Phase 2.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Format Requirements */}
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
                <p className="text-sm text-muted-foreground">First row must contain column names</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Consistent columns</p>
                <p className="text-sm text-muted-foreground">All rows must have the same number of columns</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">UTF-8 encoding</p>
                <p className="text-sm text-muted-foreground">Files must be UTF-8 encoded</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Phase 1 Implementation</p>
                <p className="text-sm text-muted-foreground">
                  CSV parsing, validation, and initial profiling will be implemented in Phase 2.
                  This page shows the planned interface design with working file selection.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected File Preview */}
      {selectedFile && !fileError && (
        <Card className="border-success">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>File Ready for Processing</CardTitle>
                <CardDescription>
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </CardDescription>
              </div>
              <Badge variant="success">Valid CSV</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Process Dataset
              </Button>
              <Button variant="outline" onClick={removeFile}>
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Dataset processing will be implemented in Phase 2. The file is validated and ready.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
