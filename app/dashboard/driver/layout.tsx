'use client';

import { useState } from 'react';
import Sidebar, { MobileSidebar, SidebarLink } from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';
import { LayoutDashboard, Route, Camera, DollarSign, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const driverLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/dashboard/driver', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'My Trips', href: '/dashboard/driver/trips', icon: <Route className="w-5 h-5" />, badge: 2 },
  { label: 'Proof of Delivery', href: '/dashboard/driver/pod', icon: <Camera className="w-5 h-5" /> },
  { label: 'Earnings', href: '/dashboard/driver/earnings', icon: <DollarSign className="w-5 h-5" /> },
  { label: 'How It Works', href: '/dashboard/driver/how-it-works', icon: <BookOpen className="w-5 h-5" /> },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userProfile } = useAuth();
  
  const fullName = `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Driver';
  const license = userProfile?.driverLicense || 'Driver';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar links={driverLinks} role="driver" userName={fullName} userRole="Professional Driver" />
      <MobileSidebar links={driverLinks} role="driver" userName={fullName} userRole="Driver" isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:ml-[260px]">
        <TopBar title="Driver Portal" subtitle={`${fullName} • ${license}`} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
