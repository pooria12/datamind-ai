import { useState, useMemo, useCallback } from "react";
import {
  ArrowUpDown,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Pagination } from "@components/ui/Pagination";
import { Separator } from "@components/ui/Separator";
import { cn } from "@lib/utils";

interface DatasetTableProps {
  columns: string[];
  rows: Array<Record<string, string>>;
  totalRecords: number;
  totalColumns: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

const DEFAULT_PAGE_SIZE = 25;

export function DatasetTable({
  columns,
  rows,
  totalRecords,
  totalColumns,
  pageSize: propPageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
  onPageSizeChange,
  className,
}: DatasetTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some(
        (val) => val != null && val.toString().toLowerCase().includes(query)
      )
    );
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortColumn) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortColumn] ?? "";
      const bVal = b[sortColumn] ?? "";
      const comparison = aVal.localeCompare(bVal, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredRows, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedRows.length / propPageSize);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * propPageSize;
    return sortedRows.slice(start, start + propPageSize);
  }, [sortedRows, currentPage, propPageSize]);

  const handleSort = useCallback((col: string) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  }, [sortColumn, sortDirection]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      onPageChange?.(page);
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback((size: number) => {
    setCurrentPage(1);
    onPageSizeChange?.(size);
  }, [onPageSizeChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                {totalRecords.toLocaleString()} records × {totalColumns} columns
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search records…"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-64"
              />
              {searchQuery && (
                <Button variant="outline" size="sm" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm" role="table" aria-label="Dataset records">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">
                    #
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:bg-muted/30 transition-colors",
                        sortColumn === col && "bg-primary/10 text-primary",
                        cn(
                          "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:bg-muted/30 transition-colors",
                          sortColumn === col && "bg-primary/10 text-primary"
                        )
                      )}
                      onClick={() => handleSort(col)}
                    >
                      <div className="flex items-center gap-1">
                        {col}
                        {sortColumn === col && (
                          <span className="text-xs">
                            {sortDirection === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 ml-1" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-muted-foreground">
                      {searchQuery ? "No matching records found" : "No data available"}
                    </td>
                  </tr>
                )}
                {paginatedRows.map((row, rowIndex) => {
                  const globalIndex = (currentPage - 1) * propPageSize + rowIndex + 1;
                  return (
                    <tr
                      key={globalIndex}
                      className={cn(
                        "border-b border-border hover:bg-muted/30 transition-colors",
                        globalIndex % 2 === 0 && "bg-muted/10"
                      )}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                        {globalIndex}
                      </td>
                      {columns.map((col) => {
                        const val = row[col];
                        const isMissing = val == null || val.trim() === "";
                        return (
                          <td
                            key={col}
                            className={cn(
                              "px-4 py-3 text-sm",
                              isMissing &&
                                "text-muted-foreground/50 italic"
                            )}
                            title={val != null ? val : undefined}
                          >
                            {isMissing ? (
                              <span className="flex items-center gap-1">
                                <EyeOff className="h-3 w-3" />
                                <span className="text-xs">—</span>
                              </span>
                            ) : (
                              <span className="truncate max-w-xs block" title={val}>
                                {val}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(totalPages, 1)}
            onPageChange={handlePageChange}
            pageSize={propPageSize}
            onPageSizeChange={handlePageSizeChange}
            totalItems={sortedRows.length}
            showPageSizes
            pageSizes={[10, 25, 50, 100]}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {paginatedRows.length} of {sortedRows.length} records
        </span>
        <span>
          {searchQuery ? `${searchQuery} matches found` : ""}
        </span>
      </div>
    </div>
  );
}
