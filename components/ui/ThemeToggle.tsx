'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'navbar' | 'default';
}

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="p-2 w-9 h-9 rounded-lg border border-transparent flex items-center justify-center opacity-50" disabled>
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const isDark = theme === 'dark';
  const iconColor = variant === 'navbar' ? '#FFFFFF' : (isDark ? '#f8fafc' : '#0F172A');

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        "p-2 rounded-lg transition-colors flex items-center justify-center border w-9 h-9",
        variant === 'navbar'
          ? "hover:bg-white/10 border-white/20"
          : "hover:bg-black/5 dark:hover:bg-white/5 border-transparent"
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5" style={{ color: iconColor }} />
      ) : (
        <Moon className="h-5 w-5" style={{ color: iconColor }} />
      )}
    </button>
  );
}
