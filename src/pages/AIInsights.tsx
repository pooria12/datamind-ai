import { Brain, Sparkles, Lightbulb, MessageSquare, Zap, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { PageHeader } from '@components/common/PageHeader';

const aiFeatures = [
  {
    title: 'Data Quality Explanations',
    description: 'Natural language explanations of detected quality issues',
    icon: MessageSquare,
    status: 'planned',
  },
  {
    title: 'Cleaning Recommendations',
    description: 'AI-suggested cleaning operations with rationale',
    icon: Lightbulb,
    status: 'planned',
  },
  {
    title: 'Pattern Detection',
    description: 'Automatic discovery of patterns, anomalies, and relationships',
    icon: Sparkles,
    status: 'planned',
  },
  {
    title: 'Insight Generation',
    description: 'Executive summaries and actionable insights from your data',
    icon: Brain,
    status: 'planned',
  },
];

export function AIInsights() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Insights"
        description="AI-powered analysis and recommendations"
        badge="Phase 3"
        badgeVariant="info"
      />

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            AI Integration Not Available
          </CardTitle>
          <CardDescription>
            This feature requires backend AI integration which will be implemented in Phase 3.
            No AI responses are simulated in Phase 0.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All AI functionality will be implemented server-side through Cloudflare Workers
            to keep API keys secure and enable proper prompt engineering.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {aiFeatures.map((feature) => (
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
          <CardTitle>Planned AI Capabilities</CardTitle>
          <CardDescription>Features coming in Phase 3</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Zap className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="font-medium">Secure Server-Side AI</p>
                <p className="text-sm text-muted-foreground">
                  All AI processing happens in Cloudflare Workers, never in the browser
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Shield className="h-5 w-5 text-success shrink-0" />
              <div>
                <p className="font-medium">No API Keys in Frontend</p>
                <p className="text-sm text-muted-foreground">
                  API keys stored securely in Worker environment variables
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Brain className="h-5 w-5 text-info shrink-0" />
              <div>
                <p className="font-medium">Context-Aware Prompts</p>
                <p className="text-sm text-muted-foreground">
                  Prompts include dataset schema and quality metrics for relevant insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Sparkles className="h-5 w-5 text-warning shrink-0" />
              <div>
                <p className="font-medium">Explainable Recommendations</p>
                <p className="text-sm text-muted-foreground">
                  Every AI suggestion includes reasoning and confidence scores
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}