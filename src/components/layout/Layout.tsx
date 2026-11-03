import { ReactNode, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageContainer } from './PageContainer';
import { cn } from '@lib/utils';
import { getBreadcrumbs } from '@lib/navigation';

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onToggleCollapse={toggleCollapse}
        isCollapsed={sidebarCollapsed}
      />

      {/* The sidebar is fixed on every breakpoint, so content only reserves space on lg+ */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-200 lg:pl-64',
          sidebarCollapsed && 'lg:pl-20'
        )}
      >
        <Header breadcrumbs={getBreadcrumbs(pathname)} onMenuClick={toggleSidebar} />

        <main className="flex-1">
          <PageContainer>{children || <Outlet />}</PageContainer>
        </main>
      </div>
    </div>
  );
}
