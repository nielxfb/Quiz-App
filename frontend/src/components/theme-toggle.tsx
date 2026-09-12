import { ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="rounded-r-none border-r-0"
        aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      >
        {resolvedTheme === 'dark' ? <Moon /> : <Sun />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-l-none" aria-label="Theme options">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')} data-active={theme === 'light'}>
            <Sun /> Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')} data-active={theme === 'dark'}>
            <Moon /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')} data-active={theme === 'system'}>
            <Monitor /> System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
