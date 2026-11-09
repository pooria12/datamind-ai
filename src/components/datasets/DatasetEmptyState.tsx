import {
  Upload as UploadIcon,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { EmptyState } from "@components/common/EmptyState";
import { useNavigate } from "react-router-dom";

interface DatasetEmptyStateProps {
  variant: "no-dataset" | "no-results" | "error";
  message?: string;
  onUpload?: () => void;
  onRetry?: () => void;
  onRefresh?: () => void;
}

export function DatasetEmptyState({
  variant = "no-dataset",
  message,
  onUpload,
  onRetry,
  onRefresh,
}: DatasetEmptyStateProps) {
  const navigate = useNavigate();

  const configs: Record<string, {
    icon: React.ReactNode;
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  }> = {
    "no-dataset": {
      icon: <UploadIcon className="h-10 w-10 text-muted-foreground" />,
      title: "No Dataset Loaded",
      description:
        "Upload a CSV file from the Upload page to view, analyze, and explore your data here.",
      primaryAction: {
        label: "Upload Dataset",
        onClick: () => onUpload?.() ?? navigate("/upload"),
      },
    },
    "no-results": {
      icon: <Compass className="h-10 w-10 text-muted-foreground" />,
      title: "No Results",
      description: message ?? "No data matches your current filters.",
      primaryAction: {
        label: "Clear Filters",
        onClick: onRefresh ?? (() => navigate("/preview")),
      },
    },
    error: {
      icon: <AlertTriangle className="h-10 w-10 text-destructive" />,
      title: "Dataset Error",
      description: message ?? "An error occurred while loading the dataset.",
      primaryAction: {
        label: "Retry",
        onClick: onRetry ?? (() => navigate("/upload")),
      },
      secondaryAction: {
        label: "Upload New Dataset",
        onClick: () => onUpload?.() ?? navigate("/upload"),
      },
    },
  };

  const config = configs[variant];

  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      action={
        config.primaryAction ? {
          label: config.primaryAction.label,
          onClick: config.primaryAction.onClick,
        } : undefined
      }
    />
  );
}
