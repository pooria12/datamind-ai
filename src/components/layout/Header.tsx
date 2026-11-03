import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sun, Moon, User } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useTheme } from '@hooks/useTheme';
import type { Breadcrumb } from '@lib/navigation';

interface HeaderProps {
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
  onMenuClick?: () => void;
}

export function Header({ breadcrumbs, action, onMenuClick }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <nav className="flex flex-1 items-center gap-2 overflow-x-auto" aria-label="Breadcrumb">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <ol className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1">
                {index > 0 && <span className="text-muted-foreground">/</span>}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </nav>

      <div className="flex items-center gap-2">
        {action}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" aria-label="User menu">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
