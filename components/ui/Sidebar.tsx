'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, X, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface SidebarProps {
  links: SidebarLink[];
  role: 'client' | 'driver' | 'admin';
  userName?: string;
  userRole?: string;
}

const roleBg: Record<string, string> = {
  client: '#1B211A',
  driver: '#1B211A',
  admin: '#1B211A',
};

export default function Sidebar({ links, role, userName = 'User', userRole = 'Client' }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
        style={{ background: roleBg[role] }}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--orange)' }}>
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-sm">OBELS DAVE</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: 'var(--orange)' }}>
              <Truck className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== `/dashboard/${role}` && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-orange text-white shadow-md"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
                title={collapsed ? link.label : undefined}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {!collapsed && <span>{link.label}</span>}
                {!collapsed && link.badge && (
                  <span className="ml-auto bg-orange/20 text-orange text-xs font-semibold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: 'var(--orange)' }}>
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-white/40 text-xs">{userRole}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

/* Mobile Sidebar Overlay */
export function MobileSidebar({
  links, role, userName = 'User', userRole = 'Client', isOpen, onClose
}: SidebarProps & { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-[260px] flex flex-col" style={{ background: 'var(--navy)' }}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--orange)' }}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-sm">OBELS DAVE</span>
          </Link>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== `/dashboard/${role}` && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive ? "bg-orange text-white shadow-md" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-auto bg-orange/20 text-orange text-xs font-semibold px-2 py-0.5 rounded-full">{link.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: 'var(--orange)' }}>
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{userName}</p>
              <p className="text-white/40 text-xs">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
