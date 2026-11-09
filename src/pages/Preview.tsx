import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { PageHeader } from '@components/common/PageHeader';
import { EmptyState } from '@components/common/EmptyState';
import { cn } from '@lib/utils';

interface SampleRow {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: string;
  hireDate: string;
}

const sampleColumns: Array<{ key: keyof SampleRow; header: string; align?: 'left' | 'center' | 'right' }> = [
  { key: 'id', header: 'ID', align: 'center' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'department', header: 'Department' },
  { key: 'salary', header: 'Salary', align: 'right' },
  { key: 'hireDate', header: 'Hire Date', align: 'center' },
];

const sampleData: SampleRow[] = [
  { id: '1001', name: 'Alice Chen', email: 'alice.chen@example.com', department: 'Engineering', salary: '112,000', hireDate: '2023-01-15' },
  { id: '1002', name: 'Marcus Wright', email: 'marcus.wright@example.com', department: 'Marketing', salary: '94,500', hireDate: '2022-06-02' },
  { id: '1003', name: 'Sofia Rodriguez', email: 'sofia.rodriguez@example.com', department: 'Design', salary: '98,000', hireDate: '2023-03-10' },
  { id: '1004', name: 'David Park', email: 'david.park@example.com', department: 'Engineering', salary: '108,000', hireDate: '2021-11-20' },
  { id: '1005', name: 'Emily Foster', email: 'emily.foster@example.com', department: 'Sales', salary: '87,500', hireDate: '2023-07-05' },
];

export function Preview() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredData = sampleData.filter((row) =>
    Object.values(row).some((val) => val.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

      {/* Sample table preview - clearly labeled */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Data Preview Table</CardTitle>
            <CardDescription>Sample table structure — displays when a dataset is loaded</CardDescription>
          </div>
          <Badge variant="outline">Sample Data</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <InputWithIcon
                placeholder="Search columns…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
              />
              <span className="text-xs text-muted-foreground">
                {filteredData.length} matching rows
              </span>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Sample data preview">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      {sampleColumns.map((col) => (
                        <th
                          key={col.key}
                          scope="col"
                          className={cn(
                            'px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                            col.align === 'center' && 'text-center',
                            col.align === 'right' && 'text-right'
                          )}
                        >
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row) => (
                      <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        {sampleColumns.map((col) => (
                          <td
                            key={col.key}
                            className={cn(
                              'px-4 py-3 text-sm text-foreground',
                              col.align === 'center' && 'text-center',
                              col.align === 'right' && 'text-right',
                              col.key === 'id' && 'font-mono text-muted-foreground'
                            )}
                          >
                            {row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedData.length} of {filteredData.length} rows
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  aria-label="First page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm font-medium text-foreground">
                  Page {currentPage} of {Math.max(totalPages, 1)}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(totalPages)}
                  aria-label="Last page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Column Information</CardTitle>
          <CardDescription>Column types and statistics will appear here after upload</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Search className="h-8 w-8 text-muted-foreground" />}
            title="No Column Data"
            description="Column analysis will be available after uploading a dataset."
          />
        </CardContent>
      </Card>

      <div className="rounded-lg border border-info/30 bg-info/5 p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Sample data notice</p>
            <p className="text-sm text-muted-foreground">
              The table above shows illustrative sample data to demonstrate the preview layout.
              No real dataset has been loaded. Upload a CSV file to view your actual data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputWithIconProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

function InputWithIcon({ placeholder, value, onChange, onClear }: InputWithIconProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-9 h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
