import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDataset } from "@hooks/useDataset";
import { DatasetTable } from "@components/datasets/DatasetTable";
import { DatasetSummary } from "@components/datasets/DatasetSummary";
import { DatasetEmptyState } from "@components/datasets/DatasetEmptyState";
import { PageHeader } from "@components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/Card";
import { Badge } from "@components/ui/Badge";
import { Button } from "@components/ui/Button";

export function Preview() {
  const navigate = useNavigate();
  const {
    dataset,
    records,
    status,
    clearDataset,
    loadRecords,
  } = useDataset();

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const columns = dataset?.columns?.map((c) => c.name) ?? [];

  if (!dataset || status === "idle") {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Data Preview"
          description="Explore your dataset structure and sample data"
          badge="Phase 2"
          badgeVariant="info"
        />
        <DatasetEmptyState variant="no-dataset" onUpload={() => navigate("/upload")} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Data Preview"
          description="Explore your dataset structure and sample data"
          badge="Phase 2"
          badgeVariant="info"
        />
        <DatasetEmptyState
          variant="error"
          message="Failed to process the dataset. Please upload a valid CSV file."
          onRetry={() => navigate("/upload")}
          onUpload={() => navigate("/upload")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data Preview"
        description={`Viewing ${dataset.filename} — ${dataset.recordCount.toLocaleString()} records × ${dataset.columnCount} columns`}
        badge={status === "warning" ? "Has warnings" : "Ready"}
        badgeVariant={status === "warning" ? "warning" : "info"}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DatasetSummary
          dataset={{
            filename: dataset.filename,
            fileSize: dataset.fileSize,
            recordCount: dataset.recordCount,
            columnCount: dataset.columnCount,
            lastProcessedAt: dataset.lastProcessedAt,
            status: dataset.status,
            completenessPercentage: dataset.profile?.completenessPercentage,
            duplicateRecords: dataset.profile?.duplicateRecords,
            parsingWarningCount: dataset.profile?.parsingWarningCount,
            parsingErrorCount: dataset.profile?.parsingErrorCount,
            columns: dataset.columns,
          }}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dataset Records</CardTitle>
            <CardDescription>
              Real data from your uploaded CSV file
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={status === "warning" ? "warning" : "success"}>
              {status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearDataset()}
            >
              Remove Dataset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dataset.profile && dataset.profile.columnMetadata.length > 0 ? (
            <DatasetTable
              columns={columns}
              rows={records ?? []}
              totalRecords={dataset.recordCount}
              totalColumns={dataset.columnCount}
            />
          ) : (
            <DatasetEmptyState variant="no-results" message="No data available" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
