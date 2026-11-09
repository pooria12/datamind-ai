import { useDataset } from "@hooks/useDataset";
import { AlertCircle, FileText, HelpCircle, TrendingUp, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/Card";
import { Badge } from "@components/ui/Badge";
import { PageHeader } from "@components/common/PageHeader";
import { DatasetEmptyState } from "@components/datasets/DatasetEmptyState";
import { Progress } from "@components/ui/Progress";
import { cn } from "@lib/utils";

export function Quality() {
  const { dataset, status } = useDataset();
  const profile = dataset?.profile;
  const qualityReport = dataset?.qualityReport;

  if (!dataset || status === "idle") {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Data Quality"
          description="Assess and monitor your dataset quality metrics"
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
          title="Data Quality"
          description="Assess and monitor your dataset quality metrics"
          badge="Phase 2"
          badgeVariant="info"
        />
        <DatasetEmptyState
          variant="error"
          message="Failed to process the dataset. Please upload a valid CSV file."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data Quality"
        description="Assess and monitor your dataset quality metrics"
        badge="Phase 2"
        badgeVariant="info"
      />

      {profile ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardReal
            title="Completeness"
            value={profile.completenessPercentage.toFixed(1) + "%"}
            description="Non-empty cells across all columns"
            icon={<HelpCircle className="h-6 w-6" />}
            iconBg="bg-info/10"
            _iconColor="text-info"
            progress={{
              value: profile.completenessPercentage,
              max: 100,
              variant: profile.completenessPercentage > 80 ? "success" : profile.completenessPercentage > 50 ? "warning" : "destructive",
            }}
          />
          <StatCardReal
            title="Uniqueness"
            value={profile.uniqueRecords.toLocaleString()}
            description="Unique records out of {profile.totalRecords.toLocaleString()}"
            icon={<Copy className="h-6 w-6" />}
            iconBg="bg-success/10"
            _iconColor="text-success"
          />
          <StatCardReal
            title="Missing Values"
            value={profile.emptyCells.toLocaleString()}
            description="Empty cells across dataset"
            icon={<FileText className="h-6 w-6" />}
            iconBg="bg-warning/10"
            _iconColor="text-warning"
          />
          <StatCardReal
            title="Duplicate Records"
            value={profile.duplicateRecords.toLocaleString()}
            description={`{((profile.duplicatePercentage || 0)).toFixed(1)}% of records`}
            icon={<AlertCircle className="h-6 w-6" />}
            iconBg={profile.duplicateRecords > 0 ? "bg-destructive/10" : "bg-success/10"}
            _iconColor={profile.duplicateRecords > 0 ? "text-destructive" : "text-success"}
          />
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Quality Issues</CardTitle>
          <CardDescription>Detected issues in the dataset</CardDescription>
        </CardHeader>
        <CardContent>
          {qualityReport && qualityReport.issues.length > 0 ? (
            <div className="space-y-3">
              {qualityReport.issues.map((issue, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3 p-3 border border-border rounded-lg",
                    issue.severity === "high" && "border-destructive/20 bg-destructive/5",
                    issue.severity === "medium" && "border-warning/20 bg-warning/5",
                    issue.severity === "low" && "border-info/20 bg-info/5"
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                    {issue.severity === "high" ? (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    ) : issue.severity === "medium" ? (
                      <FileText className="h-5 w-5 text-warning" />
                    ) : (
                      <HelpCircle className="h-5 w-5 text-info" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground">{issue.type.replace(/_/g, " ")}</h4>
                      <Badge variant={issue.severity === "high" ? "destructive" : issue.severity === "medium" ? "warning" : "info"}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                    {issue.columnName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Column: {issue.columnName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Affected records: {issue.affectedRecordCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <TrendingUp className="h-8 w-8 text-success" />
              <h3 className="mt-3 text-sm font-medium text-foreground">No quality issues detected</h3>
              <p className="text-sm text-muted-foreground">Your dataset looks clean!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Column Quality Details</CardTitle>
          <CardDescription>Per-column breakdown of missing values and types</CardDescription>
        </CardHeader>
        <CardContent>
          {profile && profile.columnMetadata.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Column</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Missing</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Missing %</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Unique</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.columnMetadata.map((col) => (
                    <tr key={col.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{col.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{col.dataType}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground font-mono">{col.missingCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground font-mono">{col.missingPercentage.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground font-mono">{col.uniqueCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          variant={
                            col.missingPercentage > 50 ? "destructive" : col.missingPercentage > 20 ? "warning" : "success"
                          }
                        >
                          {col.missingPercentage > 50 ? "Critical" : col.missingPercentage > 20 ? "Warning" : "Good"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <DatasetEmptyState variant="no-results" message="No column data available" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardRealProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  iconBg?: string;
  _iconColor?: string;
  progress?: {
    value: number;
    max?: number;
    variant?: "default" | "success" | "warning" | "destructive" | "info";
  };
}

function StatCardReal({
  title,
  value,
  description,
  icon,
  iconBg = "bg-primary/10",
  progress,
}: StatCardRealProps) {
  return (
    <Card className="h-full text-center">
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className={cn("h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
            {icon}
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className="mt-1 flex items-baseline justify-center gap-1">
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        {progress && (
          <div className="mt-4">
            <Progress value={progress.value} max={progress.max} variant={progress.variant} size="sm" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
