import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/use-auth';

export function GuestRoute() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
