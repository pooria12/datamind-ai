import { BarChart, PieChart, ScatterChart, LineChart, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { PageHeader } from '@components/common/PageHeader';

const analysisFeatures = [
  {
    title: 'Column Analysis',
    description: 'Statistical summary, distributions, and unique value counts for each column',
    icon: BarChart,
    status: 'planned',
  },
  {
    title: 'Correlation Analysis',
    description: 'Correlation matrix and pairwise relationships between numeric columns',
    icon: ScatterChart,
    status: 'planned',
  },
  {
    title: 'Distribution Charts',
    description: 'Histograms, box plots, and density plots for numeric columns',
    icon: LineChart,
    status: 'planned',
  },
  {
    title: 'Categorical Analysis',
    description: 'Frequency tables, bar charts, and category distributions',
    icon: PieChart,
    status: 'planned',
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
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Column Selector</p>
                  <p className="text-sm text-muted-foreground">Choose columns to analyze</p>
                </div>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Filter & Sort</p>
                  <p className="text-sm text-muted-foreground">Apply filters to focus on subsets</p>
                </div>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <BarChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Export Charts</p>
                  <p className="text-sm text-muted-foreground">Download visualizations as PNG/SVG</p>
                </div>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-info/50">
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