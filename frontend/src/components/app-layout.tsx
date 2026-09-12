import { Outlet, useNavigate } from 'react-router-dom';
import { useCurrentUser, useLogout } from '@/hooks/use-auth';
import { useServerTime } from '@/hooks/use-server-time';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export function AppLayout() {
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  const logout = useLogout();
  const serverTime = useServerTime();

  function handleLogout() {
    logout.mutate(undefined, { onSuccess: () => navigate('/login', { replace: true }) });
  }

  return (
    <div className="min-h-svh">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-semibold">Quiz App</span>
        <div className="flex items-center gap-4">
          {serverTime && (
            <span className="text-muted-foreground text-sm tabular-nums">
              {serverTime.toLocaleTimeString()}
            </span>
          )}
          {user && <span className="text-muted-foreground text-sm">{user.username}</span>}
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={logout.isPending}>
            Log out
          </Button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
