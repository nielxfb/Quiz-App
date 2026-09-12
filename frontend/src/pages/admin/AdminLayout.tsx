import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin/quizzes', label: 'Quizzes' },
  { to: '/admin/users', label: 'Users' },
];

export function AdminLayout() {
  return (
    <div>
      <nav className="mb-6 flex gap-4 border-b">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'border-b-2 border-transparent px-1 pb-3 text-sm font-medium',
                isActive
                  ? 'border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
