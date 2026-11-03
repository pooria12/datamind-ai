import { AlertCircle, FileText, HelpCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { PageHeader } from '@components/common/PageHeader';

const qualityChecks = [
  {
    title: 'Missing Values',
    description: 'Detect and quantify missing or null values across all columns',
    icon: HelpCircle,
    status: 'pending',
    metric: '—',
  },
  {
    title: 'Duplicate Records',
    description: 'Identify and count duplicate rows in the dataset',
    icon: FileText,
    status: 'pending',
    metric: '—',
  },
  {
    title: 'Invalid Values',
    description: 'Find values that don\'t match expected formats or constraints',
    icon: AlertCircle,
    status: 'pending',
    metric: '—',
  },
  {
    title: 'Data Quality Score',
    description: 'Overall quality score based on completeness, validity, and consistency',
    icon: TrendingUp,
    status: 'pending',
    metric: '—',
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {qualityChecks.map((check) => (
          <Card key={check.title} className="text-center">
            <CardContent className="py-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <check.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground">{check.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{check.metric}</p>
              <Badge variant="outline" className="mt-2">
                Not Analyzed
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality Checks</CardTitle>
          <CardDescription>Detailed analysis for each quality dimension</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualityChecks.map((check) => (
              <div
                key={check.title}
                className="flex items-start gap-4 p-4 border border-border rounded-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <check.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{check.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{check.description}</p>
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

      <Card className="border-warning/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Phase 2 Feature
          </CardTitle>
          <CardDescription>
            Data quality analysis including missing value detection, duplicate identification,
            invalid value flagging, and overall quality scoring will be implemented in Phase 2.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}