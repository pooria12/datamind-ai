import { Upload as UploadIcon, FileText, Info, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageHeader } from '@components/common/PageHeader';

export function Upload() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Upload Dataset"
        description="Import CSV files to begin analyzing your data"
        badge="Phase 1"
        badgeVariant="info"
      />

      <Card>
        <CardHeader>
          <CardTitle>Drag & Drop CSV File</CardTitle>
          <CardDescription>
            Drop your CSV file here or click to browse. Maximum file size: 100MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <UploadIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 text-lg font-medium text-foreground">Drop CSV file here</p>
            <p className="mb-6 text-muted-foreground">or</p>
            <Button variant="outline" className="mb-4">
              <FileText className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            <p className="text-sm text-muted-foreground">
              CSV format only. Full processing will be available in Phase 1.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSV Format Requirements</CardTitle>
          <CardDescription>Ensure your data meets these requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Header row required</p>
                <p className="text-sm text-muted-foreground">First row must contain column names</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Consistent columns</p>
                <p className="text-sm text-muted-foreground">All rows must have the same number of columns</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">UTF-8 encoding</p>
                <p className="text-sm text-muted-foreground">Files must be UTF-8 encoded</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Phase 1 Implementation</p>
                <p className="text-sm text-muted-foreground">
                  CSV parsing, validation, and initial profiling will be implemented in Phase 1.
                  This page shows the planned interface design.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}