import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Upload as UploadIcon,
  Brain,
  Sparkles,
  CheckCircle,
  Eye,
  BarChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { buttonStyles } from '@components/ui/button-styles';
import { PageHeader } from '@components/common/PageHeader';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string;
  comingSoon?: boolean;
}

function FeatureCard({ title, description, icon: Icon, path, badge, comingSoon = false }: FeatureCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Icon className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {badge && (
              <Badge variant="info" className="mt-1">
                {badge}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* A styled link, not a link nested inside a button (invalid HTML) */}
        <Link
          to={path}
          className={buttonStyles({ variant: comingSoon ? 'outline' : 'primary', className: 'w-full' })}
        >
          {comingSoon ? 'View Preview' : 'Get Started'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

const features: FeatureCardProps[] = [
  { title: 'Upload Dataset', description: 'Import CSV files and begin your data analysis journey', icon: UploadIcon, path: '/upload', badge: 'Phase 1', comingSoon: true },
  { title: 'Data Preview', description: 'Explore dataset structure, columns, and sample rows', icon: Eye, path: '/preview', badge: 'Phase 1', comingSoon: true },
  { title: 'Data Quality', description: 'Detect missing values, duplicates, and inconsistencies', icon: CheckCircle, path: '/quality', badge: 'Phase 2', comingSoon: true },
  { title: 'Feature Analysis', description: 'Statistical analysis, correlations, and distributions', icon: BarChart, path: '/analysis', badge: 'Phase 2', comingSoon: true },
  { title: 'AI Insights', description: 'AI-powered explanations and recommendations', icon: Brain, path: '/insights', badge: 'Phase 3', comingSoon: true },
  { title: 'Data Cleaning', description: 'Interactive cleaning workflow with before/after preview', icon: Sparkles, path: '/cleaning', badge: 'Phase 3', comingSoon: true },
];

const statusItems = [
  'Project structure and configuration',
  'Cloudflare Worker with /api/health endpoint',
  'React SPA with routing and navigation',
  'UI component library (Button, Card, Badge, etc.)',
  'Automated tests (Worker + Frontend)',
  'Production build verification',
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to DataMind AI - your AI-powered data analysis platform"
        badge="Phase 0"
        badgeVariant="info"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.path} {...feature} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
          <CardDescription>Phase 0 - Foundation Complete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusItems.map((label) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <span>{label}</span>
                </div>
                <Badge variant="success">Complete</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start working with your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/upload" className={buttonStyles({ variant: 'primary', size: 'lg' })}>
              <UploadIcon className="mr-2 h-5 w-5" />
              Upload Dataset
            </Link>
            <Link to="/settings" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
              <Sparkles className="mr-2 h-5 w-5" />
              Configure Settings
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
