import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, LogOut } from 'lucide-react';
import { cn } from '@lib/utils';
import { primaryNavItems, secondaryNavItems } from '@lib/navigation';
import { Logo } from '@components/common/Logo';
import { Button } from '@components/ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}

export function Sidebar({ isOpen, onClose, onToggleCollapse, isCollapsed }: SidebarProps) {
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

        <nav className="flex-1 overflow-y-auto p-4 space-y-6" aria-label="Navigation">
          <div className="space-y-1">
            <h2 className="px-3 text-xs font-semibold text-foreground/60 uppercase tracking-wider">Main</h2>
            <ul className="space-y-0.5">
              {primaryNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary-sm'
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
          </div>

          <div className="space-y-1">
            <h2 className="px-3 text-xs font-semibold text-foreground/60 uppercase tracking-wider">Workspace</h2>
            <ul className="space-y-0.5">
              {secondaryNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        isCollapsed && 'lg:justify-center lg:px-2'
                      )
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className={cn('truncate', hideWhenCollapsed)}>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-lg justify-center"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 shrink-0" />
            ) : (
              <ChevronLeft className="h-5 w-5 shrink-0" />
            )}
          </Button>
        </div>

        <div className="mt-auto border-t border-border p-4">
          <button
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn('truncate', hideWhenCollapsed)}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
