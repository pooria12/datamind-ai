import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@lib/utils';
import { navItems } from '@lib/navigation';
import { Logo } from '@components/common/Logo';
import { Button } from '@components/ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}

export function Sidebar({ isOpen, onClose, onToggleCollapse, isCollapsed }: SidebarProps) {
  // Collapsing only applies from lg up; on mobile the drawer is always full width.
  const hideWhenCollapsed = isCollapsed && 'lg:hidden';

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-[transform,width] duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed && 'lg:w-20'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Logo size="md" textClassName={cn(hideWhenCollapsed)} />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4" aria-label="Navigation">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      isCollapsed && 'lg:justify-center lg:px-2'
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className={cn('truncate', hideWhenCollapsed)}>{item.label}</span>
                </NavLink>
                {item.description && (
                  <p className={cn('ml-10 mt-0.5 text-xs text-muted-foreground', hideWhenCollapsed)}>
                    {item.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden border-t border-border p-4 lg:block">
          <Button
            variant="ghost"
            className={cn('w-full justify-start gap-3', isCollapsed && 'justify-center px-2')}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 shrink-0" />
            ) : (
              <ChevronLeft className="h-5 w-5 shrink-0" />
            )}
            {!isCollapsed && <span>Collapse</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
