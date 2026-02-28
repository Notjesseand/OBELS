'use client';

import { useState } from 'react';
import Sidebar, { MobileSidebar, SidebarLink } from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';
import { LayoutDashboard, FileText, Truck, MapPin, Receipt, Calculator, CreditCard, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const clientLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/dashboard/client', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Request Quote', href: '/dashboard/client/quote', icon: <Calculator className="w-5 h-5" /> },
  { label: 'Book Shipment', href: '/dashboard/client/book', icon: <Truck className="w-5 h-5" /> },
  { label: 'My Shipments', href: '/dashboard/client/shipments', icon: <FileText className="w-5 h-5" />, badge: 3 },
  { label: 'Live Tracking', href: '/dashboard/client/tracking', icon: <MapPin className="w-5 h-5" /> },
  { label: 'Invoices', href: '/dashboard/client/invoices', icon: <Receipt className="w-5 h-5" /> },
  { label: 'Payments', href: '/dashboard/client/payment', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'How It Works', href: '/dashboard/client/how-it-works', icon: <BookOpen className="w-5 h-5" /> },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userProfile } = useAuth();

  const fullName = `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || '';
  const company = userProfile?.companyName || '';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar links={clientLinks} role="client" userName={fullName} userRole={company} />
      <MobileSidebar links={clientLinks} role="client" userName={fullName} userRole={company} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:ml-[260px]">
        <TopBar title="Dashboard" subtitle={company} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
