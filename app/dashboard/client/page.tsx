'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Package, Truck, MapPin, Receipt, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { onClientShipmentsSnapshot, getRecentActivity, ShipmentRecord, ActivityItem } from '@/lib/tracking';
import { Timestamp } from 'firebase/firestore';

function timeAgo(ts: Timestamp | Date): string {
  const now = Date.now();
  const then = ts instanceof Timestamp ? ts.toMillis() : new Date(ts).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ClientDashboard() {
  const { user, userProfile } = useAuth();
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = user?.email || userProfile?.email;
    if (!email) { setLoading(false); return; }
    const unsub = onClientShipmentsSnapshot(email, data => {
      setShipments(data);
      setLoading(false);
    });
    return unsub;
  }, [user, userProfile]);

  // Fetch recent activity for this client's shipments
  useEffect(() => {
    if (shipments.length === 0) return;
    getRecentActivity(20).then(allActivity => {
      const myWaybills = new Set(shipments.map(s => s.waybillNumber));
      setActivity(allActivity.filter(a => myWaybills.has(a.waybillNumber)).slice(0, 6));
    }).catch(console.error);
  }, [shipments]);

  const activeShipments = shipments.filter(s => !['delivered', 'cancelled'].includes(s.currentStatus));
  const totalSpend = shipments.reduce((sum, s) => sum + (s.price || 0), 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{greeting()}, {userProfile?.firstName || 'Client'} 👋</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Here&apos;s an overview of your logistics activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Shipments"
          value={activeShipments.length}
          icon={<Truck className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
        />
        <StatCard
          label="Total Shipments"
          value={shipments.length}
          change="All time"
          changeType="neutral"
          icon={<Package className="w-5 h-5" style={{ color: 'var(--info)' }} />}
          iconBg="var(--info-light)"
        />
        <StatCard
          label="Delivered"
          value={shipments.filter(s => s.currentStatus === 'delivered').length}
          changeType="positive"
          icon={<MapPin className="w-5 h-5" style={{ color: 'var(--success)' }} />}
          iconBg="var(--success-light)"
        />
        <StatCard
          label="Total Spend"
          value={formatCurrency(totalSpend)}
          icon={<Receipt className="w-5 h-5" style={{ color: 'var(--warning)' }} />}
          iconBg="var(--warning-light)"
        />
      </div>

      {/* Active Shipments */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Active Shipments</h3>
          <Link href="/dashboard/client/shipments" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--orange)' }}>
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 className="w-5 h-5 animate-spin" /> Loading...
          </div>
        ) : activeShipments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No active shipments. Book one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  <th className="px-6 py-3">Waybill</th>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">ETA</th>
                  <th className="px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {activeShipments.slice(0, 5).map(s => (
                  <tr key={s.waybillNumber} className="border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-6 py-4 font-mono font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{s.waybillNumber}</td>
                    <td className="px-6 py-4">{s.origin} → {s.destination}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: s.type === 'FTL' ? 'var(--navy)' : 'var(--info)', color: 'white' }}>
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={s.currentStatus} size="sm" /></td>
                    <td className="px-6 py-4 text-xs">{s.estimatedDelivery ? formatDate(s.estimatedDelivery) : '—'}</td>
                    <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(s.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Get a Quote', href: '/dashboard/client/quote', icon: <Receipt className="w-5 h-5" />, color: 'var(--orange-100)' },
              { label: 'Book Shipment', href: '/dashboard/client/book', icon: <Truck className="w-5 h-5" />, color: 'var(--info-light)' },
              { label: 'Track Cargo', href: '/dashboard/client/tracking', icon: <MapPin className="w-5 h-5" />, color: 'var(--success-light)' },
              { label: 'View Invoices', href: '/dashboard/client/invoices', icon: <Package className="w-5 h-5" />, color: 'var(--warning-light)' },
            ].map(a => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.color, color: 'var(--text-primary)' }}>
                  {a.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
          {activity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity. Book a shipment to see updates here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--slate-50)' }}>
                  <div className="min-w-0 mr-3">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      <span className="font-mono text-xs" style={{ color: 'var(--orange)' }}>{item.waybillNumber}</span>
                      {' '}{item.origin} → {item.destination}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.note}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <StatusBadge status={item.status} size="sm" />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{timeAgo(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
