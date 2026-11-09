import {
  AlertCircle,
  FileText,
  HelpCircle,
  TrendingUp,
  Clock,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { PageHeader } from '@components/common/PageHeader';
import { EmptyState } from '@components/common/EmptyState';

const qualityDimensions = [
  {
    title: 'Completeness',
    description: 'Detect and quantify missing or null values across all columns',
    icon: HelpCircle,
    detail: 'No dataset has been uploaded yet. Upload a CSV to begin completeness analysis.',
  },
  {
    title: 'Validity',
    description: 'Find values that don\'t match expected formats or constraints',
    icon: FileText,
    detail: 'Validation rules will be applied after dataset profiling in Phase 2.',
  },
  {
    title: 'Consistency',
    description: 'Identify formatting inconsistencies across records',
    icon: Clock,
    detail: 'Consistency checks will run once data types are inferred.',
  },
  {
    title: 'Uniqueness',
    description: 'Identify and count duplicate rows in the dataset',
    icon: Copy,
    detail: 'Duplicate detection requires a loaded dataset to analyze.',
  },
];

export function Quality() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Data Quality"
        description="Assess and monitor your dataset quality metrics"
        badge="Phase 2"
        badgeVariant="info"
      />

      <EmptyState
        icon={<TrendingUp className="h-12 w-12 text-muted-foreground" />}
        title="No Dataset Analyzed"
        description="Upload a CSV file from the Upload page to run data quality analysis. Quality scores and metrics will be calculated once a dataset is loaded."
        action={{
          label: 'Upload Dataset',
          onClick: () => {},
          variant: 'outline',
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Quality Dimensions</CardTitle>
          <CardDescription>Detailed analysis for each quality dimension</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {qualityDimensions.map((dim) => (
              <div
                key={dim.title}
                className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <dim.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{dim.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{dim.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline">Pending Analysis</Badge>
                    <span className="text-xs text-muted-foreground">
                      Will be available in Phase 2
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Phase 2 Feature
          </CardTitle>
          <CardDescription>
            Data quality analysis including completeness, validity, consistency, uniqueness,
            missing value detection, duplicate identification, invalid value flagging, and
            overall quality scoring will be implemented in Phase 2.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
