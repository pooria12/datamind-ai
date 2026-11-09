import {
  BarChart,
  ScatterChart,
  LineChart,
  PieChart,
  Filter,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { PageHeader } from '@components/common/PageHeader';
import { EmptyState } from '@components/common/EmptyState';

interface AnalysisFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'planned';
  variant: 'default' | 'success' | 'warning' | 'info';
}

const analysisFeatures: AnalysisFeature[] = [
  {
    title: 'Column Analysis',
    description: 'Statistical summary, distributions, and unique value counts for each column',
    icon: BarChart,
    status: 'planned',
    variant: 'default',
  },
  {
    title: 'Correlation Analysis',
    description: 'Correlation matrix and pairwise relationships between numeric columns',
    icon: ScatterChart,
    status: 'planned',
    variant: 'default',
  },
  {
    title: 'Distribution Charts',
    description: 'Histograms, box plots, and density plots for numeric columns',
    icon: LineChart,
    status: 'planned',
    variant: 'default',
  },
  {
    title: 'Categorical Analysis',
    description: 'Frequency tables, bar charts, and category distributions',
    icon: PieChart,
    status: 'planned',
    variant: 'default',
  },
];

const analysisTools = [
  {
    title: 'Column Selector',
    description: 'Choose columns to analyze',
    icon: LayoutGrid,
  },
  {
    title: 'Filter & Sort',
    description: 'Apply filters to focus on subsets',
    icon: Filter,
  },
  {
    title: 'Export Charts',
    description: 'Download visualizations as PNG/SVG',
    icon: Search,
  },
];

export function FeatureAnalysis() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Feature Analysis"
        description="Statistical analysis and feature exploration"
        badge="Phase 2"
        badgeVariant="info"
      />

      <EmptyState
        icon={<BarChart className="h-12 w-12 text-muted-foreground" />}
        title="No Dataset Loaded"
        description="Upload a CSV file to begin feature analysis. Column statistics, correlations, and distributions will be computed once data is available."
        action={{
          label: 'Upload Dataset',
          onClick: () => {},
          variant: 'outline',
        }}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analysisFeatures.map((feature) => (
          <Card key={feature.title}>
            <CardContent className="py-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-center font-medium text-foreground">{feature.title}</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">{feature.description}</p>
              <div className="mt-4 text-center">
                <Badge variant="outline">Planned</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Tools</CardTitle>
          <CardDescription>Interactive tools for data exploration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisTools.map((tool) => (
              <div
                key={tool.title}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <tool.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tool.title}</p>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-info/50 bg-info/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-info" />
            Phase 2 Feature
          </CardTitle>
          <CardDescription>
            Feature analysis including column statistics, correlation matrices, distribution
            visualizations, and categorical analysis will be implemented in Phase 2.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
