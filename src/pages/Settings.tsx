import { User, Bell, Shield, Palette, Database, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { PageHeader } from '@components/common/PageHeader';
import { useTheme } from '@hooks/useTheme';
import type { ThemePreference } from '@lib/theme';

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function Settings() {
  const { preference, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your application preferences"
        badge="Phase 0"
        badgeVariant="default"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>Account settings and profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Authentication</p>
                <p className="text-sm text-muted-foreground">Not implemented in Phase 0</p>
              </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Key className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">API Keys</p>
                <p className="text-sm text-muted-foreground">Manage API keys for integrations</p>
              </div>
            </div>
            <Badge variant="outline">Phase 3</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Bell className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-11 h-6 bg-muted peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified of security events</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-11 h-6 bg-muted peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Palette className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Light, dark, or system preference</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {themeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={preference === option.value ? 'primary' : 'outline'}
                  size="sm"
                  aria-pressed={preference === option.value}
                  onClick={() => setTheme(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Database className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Data Retention</p>
                <p className="text-sm text-muted-foreground">How long to keep uploaded datasets (available in Phase 1)</p>
              </div>
            </div>
            <select
              className="border border-border rounded-md px-3 py-2 text-sm bg-background disabled:opacity-50"
              aria-label="Data retention"
              disabled
            >
              <option>Session only</option>
              <option>1 day</option>
              <option>7 days</option>
              <option>30 days</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Data handling and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Local Processing</p>
                <p className="text-sm text-muted-foreground">Dataset parsing is planned to run in your browser</p>
              </div>
            </div>
            <Badge variant="outline">Phase 1</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Database className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">No Cloud Storage</p>
                <p className="text-sm text-muted-foreground">Storage policy will be defined in Phase 1</p>
              </div>
            </div>
            <Badge variant="outline">Phase 1</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Key className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">AI Processing</p>
                <p className="text-sm text-muted-foreground">Server-side only (Phase 3)</p>
              </div>
            </div>
            <Badge variant="warning">Planned</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Info</CardTitle>
          <CardDescription>Version and build information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono">0.1.0 (Phase 0)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Framework</span>
            <span className="font-mono">React 19 + TypeScript</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Runtime</span>
            <span className="font-mono">Cloudflare Workers</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Styling</span>
            <span className="font-mono">Tailwind CSS v4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Build Tool</span>
            <span className="font-mono">Vite</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}