import { Sparkles, ArrowLeftRight, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageHeader } from '@components/common/PageHeader';
import { EmptyState } from '@components/common/EmptyState';

export function Cleaning() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Data Cleaning"
        description="Review and apply cleaning operations"
        badge="Phase 3"
        badgeVariant="info"
      />

      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-warning" />
            Cleaning Workflow Not Functional
          </CardTitle>
          <CardDescription>
            This page shows the planned interface for Phase 3. No actual cleaning operations
            are performed in Phase 0.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proposed Cleaning Operations</CardTitle>
          <CardDescription>Operations will be listed here after analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Sparkles className="h-8 w-8 text-muted-foreground" />}
            title="No Operations Proposed"
            description="Run data quality analysis to see suggested cleaning operations"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Before & After Preview</CardTitle>
          <CardDescription>Compare data before and after cleaning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border rounded-lg p-4">
              <h5 className="font-medium mb-2">Before Cleaning</h5>
              <div className="text-sm text-muted-foreground text-center py-8">
                No dataset loaded
              </div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h5 className="font-medium mb-2">After Cleaning</h5>
              <div className="text-sm text-muted-foreground text-center py-8">
                Preview will appear after applying operations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cleaning History</CardTitle>
          <CardDescription>Track applied operations</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<History className="h-8 w-8 text-muted-foreground" />}
            title="No Operations Applied"
            description="Applied cleaning operations will appear here"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Cleaned Data</CardTitle>
          <CardDescription>Download your cleaned dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" disabled>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Available after applying operations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}