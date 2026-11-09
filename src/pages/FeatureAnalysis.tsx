import { useDataset } from "@hooks/useDataset";
import { BarChart, ScatterChart, LineChart, PieChart, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/Card";
import { Badge } from "@components/ui/Badge";
import { PageHeader } from "@components/common/PageHeader";
import { DatasetEmptyState } from "@components/datasets/DatasetEmptyState";
import { cn } from "@lib/utils";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  integer: BarChart,
  decimal: LineChart,
  string: PieChart,
  boolean: ScatterChart,
  date: Search,
  datetime: Filter,
  empty: BarChart,
  unknown: BarChart,
};

export function FeatureAnalysis() {
  const { dataset, status } = useDataset();
  const profile = dataset?.profile;

  if (!dataset || status === "idle") {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Feature Analysis"
          description="Statistical analysis and feature exploration"
          badge="Phase 2"
          badgeVariant="info"
        />
        <DatasetEmptyState variant="no-dataset" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Feature Analysis"
          description="Statistical analysis and feature exploration"
          badge="Phase 2"
          badgeVariant="info"
        />
        <DatasetEmptyState variant="error" message="Failed to process the dataset" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Feature Analysis"
        description="Statistical analysis and feature exploration"
        badge="Phase 2"
        badgeVariant="info"
      />

      {profile ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {profile.columnMetadata.map((col) => (
            <ColumnAnalysisCard key={col.id} column={col} />
          ))}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Column Details</CardTitle>
          <CardDescription>Detailed statistics for each column</CardDescription>
        </CardHeader>
        <CardContent>
          {profile && profile.columnMetadata.length > 0 ? (
            <div className="space-y-3">
              {profile.columnMetadata.map((col) => (
                <ColumnAnalysisCard key={col.id} column={col} />
              ))}
            </div>
          ) : (
            <DatasetEmptyState variant="no-results" message="No column data available" />
          )}
        </CardContent>
      </Card>

      <Card className="border-info/30 bg-info/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-info" />
            Phase 2 Feature
          </CardTitle>
          <CardDescription>
            Feature analysis including column statistics, type inference, missing value
            detection, and duplicate detection has been implemented. Advanced statistical
            features (correlation matrices, distribution charts, etc.) will be available in
            future phases.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

interface ColumnAnalysisCardProps {
  column: {
    id: string;
    name: string;
    dataType: string;
    totalRecords: number;
    nonEmptyCount: number;
    missingCount: number;
    missingPercentage: number;
    uniqueCount: number;
    statistics?: {
      min?: number | string | Date;
      max?: number | string | Date;
      sum?: number;
      mean?: number;
      minLength?: number;
      maxLength?: number;
      avgLength?: number;
    };
  };
}

function ColumnAnalysisCard({ column }: ColumnAnalysisCardProps) {
  const Icon = TYPE_ICONS[column.dataType] ?? BarChart;
  const isNumeric = column.dataType === "integer" || column.dataType === "decimal";

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Icon className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{column.name}</h3>
            <Badge variant="outline" className="mt-1 text-xs">
              {column.dataType}
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Records</span>
            <span className="font-mono text-foreground">{column.totalRecords.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Non-empty</span>
            <span className="font-mono text-foreground">{column.nonEmptyCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Missing</span>
            <span className={cn("font-mono text-foreground", column.missingCount > 0 && "text-warning")}>
              {column.missingCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Unique</span>
            <span className="font-mono text-foreground">{column.uniqueCount.toLocaleString()}</span>
          </div>
          {isNumeric && column.statistics && (
            <div className="flex items-center justify-between text-sm border-t border-border pt-2">
              <span className="text-muted-foreground">Mean</span>
              <span className="font-mono text-foreground">{column.statistics.mean?.toFixed(2) ?? "—"}</span>
            </div>
          )}
          {!isNumeric && column.statistics && column.statistics.avgLength != null && (
            <div className="flex items-center justify-between text-sm border-t border-border pt-2">
              <span className="text-muted-foreground">Avg length</span>
              <span className="font-mono text-foreground">{column.statistics.avgLength.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
