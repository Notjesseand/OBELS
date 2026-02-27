'use client';

import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function TopBar({ title, subtitle, onMenuClick }: TopBarProps) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Menu className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        )}
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          {subtitle && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)' }}>
          <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-40"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--orange)' }} />
        </button>

        {/* Logout */}
        <a href="/login" className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors" title="Log out">
          <LogOut className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        </a>
      </div>
    </header>
  );
}
