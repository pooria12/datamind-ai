import {
  LayoutDashboard,
  Upload,
  Eye,
  CheckCircle,
  BarChart,
  Brain,
  Sparkles,
  Settings,
} from 'lucide-react';
import type { NavItem } from '@/types';

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, description: 'Overview and quick actions' },
  { label: 'Upload Dataset', path: '/upload', icon: Upload, description: 'Import CSV datasets' },
  { label: 'Data Preview', path: '/preview', icon: Eye, description: 'Explore dataset contents' },
  { label: 'Data Quality', path: '/quality', icon: CheckCircle, description: 'Quality metrics and issues' },
  { label: 'Feature Analysis', path: '/analysis', icon: BarChart, description: 'Statistical analysis' },
  { label: 'AI Insights', path: '/insights', icon: Brain, description: 'AI-powered recommendations' },
  { label: 'Data Cleaning', path: '/cleaning', icon: Sparkles, description: 'Cleaning workflow' },
  { label: 'Settings', path: '/settings', icon: Settings, description: 'Application settings' },
];

export interface Breadcrumb {
  label: string;
  path?: string;
}

/** Builds "Home / <page>" breadcrumbs for the current pathname. */
export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/') {
    return [{ label: 'Dashboard' }];
  }
  const item = navItems.find((entry) => entry.path === normalized);
  return [{ label: 'Home', path: '/' }, { label: item?.label ?? 'Not Found' }];
}
