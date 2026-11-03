import { useNavigate } from 'react-router-dom';
import { Table, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { PageHeader } from '@components/common/PageHeader';
import { EmptyState } from '@components/common/EmptyState';

export function Preview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data Preview"
        description="Explore your dataset structure and sample data"
        badge="Phase 1"
        badgeVariant="info"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dataset Overview</CardTitle>
            <CardDescription>No dataset loaded</CardDescription>
          </div>
          <Badge variant="outline">No Data</Badge>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Table className="h-8 w-8 text-muted-foreground" />}
            title="No Dataset Loaded"
            description="Upload a CSV file from the Upload page to preview your data here."
            action={{
              label: 'Upload Dataset',
              onClick: () => navigate('/upload'),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Preview Table</CardTitle>
          <CardDescription>First 100 rows will be displayed here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      No data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-8 text-center text-muted-foreground">
                      Upload a dataset to see preview
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing 0 of 0 rows
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm">Page 1</span>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Column Information</CardTitle>
          <CardDescription>Column types and statistics will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Search className="h-8 w-8 text-muted-foreground" />}
            title="No Column Data"
            description="Column analysis will be available after uploading a dataset."
          />
        </CardContent>
      </Card>
    </div>
  );
}