'use client';

import { useState } from 'react';
import Sidebar, { MobileSidebar, SidebarLink } from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';
import { LayoutDashboard, Truck, Package, Users, BarChart3, ClipboardList, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const adminLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Fleet', href: '/dashboard/admin/fleet', icon: <Truck className="w-5 h-5" />, badge: 9 },
  { label: 'Load Board', href: '/dashboard/admin/loads', icon: <ClipboardList className="w-5 h-5" />, badge: 2 },
  { label: 'Shipments', href: '/dashboard/admin/shipments', icon: <Package className="w-5 h-5" /> },
  { label: 'Users', href: '/dashboard/admin/users', icon: <Users className="w-5 h-5" /> },
  { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'How It Works', href: '/dashboard/admin/how-it-works', icon: <BookOpen className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userProfile } = useAuth();
  
  const fullName = `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Admin User';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar links={adminLinks} role="admin" userName={fullName} userRole="System Administrator" />
      <MobileSidebar links={adminLinks} role="admin" userName={fullName} userRole="Administrator" isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:ml-[260px]">
        <TopBar title="Admin Command Center" subtitle="System Administrator" onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
