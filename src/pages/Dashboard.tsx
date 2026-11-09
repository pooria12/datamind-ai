import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Upload as UploadIcon,
  Brain,
  Sparkles,
  CheckCircle,
  Eye,
  BarChart,
  TrendingUp,
  Database,
  Activity,
  Clock,
  FileText,
  LayoutGrid,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { buttonStyles } from '@components/ui/button-styles';
import { PageHeader } from '@components/common/PageHeader';
import { StatCard } from '@components/common/StatCard';
import { EmptyState } from '@components/common/EmptyState';
import { useToast } from '@hooks/useToast';
import { cn } from '@lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string;
  comingSoon?: boolean;
  onComingSoon?: () => void;
}

function FeatureCard({ title, description, icon: Icon, path, badge, comingSoon = false, onComingSoon }: FeatureCardProps) {
  return (
    <Card className="h-full transition-all hover:border-primary/20 hover:shadow-sm">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
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
        <Link
          to={path}
          className={buttonStyles({ variant: comingSoon ? 'outline' : 'primary', className: 'w-full' })}
          onClick={(e) => {
            if (comingSoon) {
              e.preventDefault();
              onComingSoon?.();
            }
          }}
        >
          {comingSoon ? 'Coming Soon' : 'Get Started'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

const features: FeatureCardProps[] = [
  { title: 'Upload Dataset', description: 'Import CSV files and begin your data analysis journey', icon: UploadIcon, path: '/upload', badge: 'Phase 1', comingSoon: false },
  { title: 'Data Preview', description: 'Explore dataset structure, columns, and sample rows', icon: Eye, path: '/preview', badge: 'Phase 1', comingSoon: true },
  { title: 'Data Quality', description: 'Detect missing values, duplicates, and inconsistencies', icon: CheckCircle, path: '/quality', badge: 'Phase 2', comingSoon: true },
  { title: 'Feature Analysis', description: 'Statistical analysis, correlations, and distributions', icon: BarChart, path: '/analysis', badge: 'Phase 2', comingSoon: true },
  { title: 'AI Insights', description: 'AI-powered explanations and recommendations', icon: Brain, path: '/insights', badge: 'Phase 3', comingSoon: true },
  { title: 'Data Cleaning', description: 'Interactive cleaning workflow with before/after preview', icon: Sparkles, path: '/cleaning', badge: 'Phase 3', comingSoon: true },
];

const onboardingSteps = [
  { step: 1, title: 'Upload a dataset', description: 'Drag and drop a CSV file or browse from your computer', path: '/upload', available: true },
  { step: 2, title: 'Explore the data', description: 'Preview columns, data types, and sample rows', path: '/preview', available: false },
  { step: 3, title: 'Review data quality', description: 'Check for missing values, duplicates, and anomalies', path: '/quality', available: false },
  { step: 4, title: 'Discover insights', description: 'Get AI-powered explanations and recommendations', path: '/insights', available: false },
  { step: 5, title: 'Clean and export', description: 'Apply cleaning operations and download cleaned data', path: '/cleaning', available: false },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: 'Coming in a future phase',
      description: 'This feature will be available once the data processing engine is implemented.',
      variant: 'info',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back to DataMind AI. Start by uploading your first dataset."
        badge="Phase 1"
        badgeVariant="info"
      />

      {/* Welcome Hero Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                Turn messy data into clear insights
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Upload a CSV file to automatically profile, analyze, and clean your data with AI assistance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/upload"
                className={buttonStyles({ variant: 'primary', size: 'lg' })}
              >
                <UploadIcon className="mr-2 h-5 w-5" />
                Upload Dataset
              </Link>
              <Link
                to="/settings"
                className={buttonStyles({ variant: 'outline', size: 'lg' })}
              >
                <LayoutGrid className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Datasets"
          value="0"
          description="No datasets uploaded yet"
          icon={<Database className="h-6 w-6" />}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          title="Last Analyzed"
          value="—"
          description="Upload a dataset to begin"
          icon={<Activity className="h-6 w-6" />}
          iconBg="bg-info/10"
          iconColor="text-info"
        />
        <StatCard
          title="Data Quality"
          value="—"
          description="Quality score pending analysis"
          icon={<TrendingUp className="h-6 w-6" />}
          iconBg="bg-success/10"
          iconColor="text-success"
        />
        <StatCard
          title="Recent Activity"
          value="0"
          description="Actions this session"
          icon={<Clock className="h-6 w-6" />}
          iconBg="bg-warning/10"
          iconColor="text-warning"
        />
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to analyze your first dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {onboardingSteps.map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold',
                  item.available ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
                )}>
                  {item.available ? item.step : <Clock className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="shrink-0">
                  {item.available ? (
                    <Link
                      to={item.path}
                      className={buttonStyles({ variant: 'primary', size: 'sm' })}
                      onClick={() => {}}
                    >
                      Go
                    </Link>
                  ) : (
                    <button
                      className={buttonStyles({ variant: 'outline', size: 'sm' })}
                      onClick={handleComingSoon}
                    >
                      Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Available Features</h3>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.path}
            {...feature}
            onComingSoon={handleComingSoon}
          />
        ))}
      </div>

      {/* Recent Datasets */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Datasets</CardTitle>
            <CardDescription>Your uploaded datasets will appear here</CardDescription>
          </div>
          <Link
            to="/upload"
            className={buttonStyles({ variant: 'outline', size: 'sm' })}
          >
            <FileText className="mr-1.5 h-4 w-4" />
            Upload Dataset
          </Link>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Database className="h-8 w-8 text-muted-foreground" />}
            title="No datasets yet"
            description="Upload your first CSV file to see it appear here with a preview of its structure and quality metrics."
            action={{
              label: 'Upload Dataset',
              onClick: () => navigate('/upload'),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
