

export interface DuplicateStats {
  totalDuplicateRecords: number;
  uniqueRecords: number;
  duplicatePercentage: number;
}

export function calculateFingerprint(row: Record<string, string>): string {
  const keys = Object.keys(row).sort();
  return keys
    .map((key) => `${key}=>${row[key] ?? ""}`)
    .join("|");
}

export function detectDuplicateRows(
  rows: Array<Record<string, string>>
): DuplicateStats {
  const seen = new Map<string, number>();
  let duplicateCount = 0;

  for (const row of rows) {
    const fp = calculateFingerprint(row);
    const count = seen.get(fp) ?? 0;
    seen.set(fp, count + 1);
    if (count > 0) {
      duplicateCount++;
    }
  }

  const uniqueRecords = seen.size;
  const totalRecords = rows.length;
  const duplicatePercentage =
    totalRecords > 0 ? (duplicateCount / totalRecords) * 100 : 0;

  return {
    totalDuplicateRecords: duplicateCount,
    uniqueRecords,
    duplicatePercentage,
  };
}

export function findDuplicateColumns(
  headers: string[]
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const header of headers) {
    counts.set(header, (counts.get(header) ?? 0) + 1);
  }

  const duplicates: Array<{ name: string; count: number }> = [];
  for (const [name, count] of counts) {
    if (count > 1) {
      duplicates.push({ name, count });
    }
  }
  return duplicates;
}
