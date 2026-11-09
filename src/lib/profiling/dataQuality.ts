import type {
  DataQualityReport,
  DataQualityIssue,
  DatasetProfile,
} from "@/types/dataset.types";

export function generateQualityReport(
  profile: DatasetProfile
): DataQualityReport {
  const { columnMetadata, completenessPercentage, duplicateRecords, totalRecords, parsingWarningCount, parsingErrorCount } = profile;

  const issues: DataQualityIssue[] = [];

  for (const col of columnMetadata) {
    if (col.missingCount > 0) {
      const severity = col.missingPercentage > 50 ? "high" : col.missingPercentage > 20 ? "medium" : "low";
      issues.push({
        type: "missing_values",
        columnId: col.id,
        columnName: col.name,
        affectedRecordCount: col.missingCount,
        severity,
        description: `${col.missingCount} missing value(s) in column "${col.name}" (${col.missingPercentage.toFixed(1)}%)`,
      });
    }
    if (col.dataType === "empty") {
      issues.push({
        type: "empty_column",
        columnId: col.id,
        columnName: col.name,
        affectedRecordCount: totalRecords,
        severity: "medium",
        description: `Column "${col.name}" contains no usable data`,
      });
    }
  }

  if (duplicateRecords > 0) {
    const severity = duplicateRecords > totalRecords * 0.1 ? "high" : "medium";
    issues.push({
      type: "duplicate_records",
      affectedRecordCount: duplicateRecords,
      severity,
      description: `${duplicateRecords} duplicate record(s) found (${((duplicateRecords / totalRecords) * 100).toFixed(1)}% of records)`,
    });
  }

  if (parsingWarningCount > 0) {
    issues.push({
      type: "parsing_warning",
      affectedRecordCount: parsingWarningCount,
      severity: "medium",
      description: `${parsingWarningCount} parsing warning(s) detected during file processing`,
    });
  }

  if (parsingErrorCount > 0) {
    issues.push({
      type: "parsing_warning",
      affectedRecordCount: parsingErrorCount,
      severity: "critical",
      description: `${parsingErrorCount} parsing error(s) detected during file processing`,
    });
  }

  const completenessScore = completenessPercentage;
  const uniquenessScore = totalRecords > 0
    ? ((totalRecords - duplicateRecords) / totalRecords) * 100
    : 100;
  const parsingValidityScore = parsingErrorCount === 0 ? 100 : Math.max(0, 100 - (parsingErrorCount / totalRecords) * 100);

  return {
    datasetId: profile.datasetId,
    completenessScore,
    uniquenessScore,
    parsingValidityScore,
    issues,
  };
}
