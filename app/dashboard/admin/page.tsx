'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import { formatCurrency, ShipmentStatus } from '@/lib/utils';
import { DollarSign, Truck, Package, Users, Activity, Loader2, MapPin, CheckCircle } from 'lucide-react';
import { onShipmentsSnapshot, getRecentActivity, ShipmentRecord, ActivityItem } from '@/lib/tracking';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

const STATUS_ICONS: Record<ShipmentStatus, { icon: string; color: string; bg: string }> = {
  'pending': { icon: '📦', color: 'var(--info)', bg: 'var(--info-light)' },
  'confirmed': { icon: '✅', color: 'var(--success)', bg: 'var(--success-light)' },
  'picked-up': { icon: '🚛', color: 'var(--orange)', bg: 'var(--orange-100)' },
  'in-transit': { icon: '🔄', color: 'var(--info)', bg: 'var(--info-light)' },
  'delivered': { icon: '🎉', color: 'var(--success)', bg: 'var(--success-light)' },
  'cancelled': { icon: '❌', color: 'var(--danger)', bg: 'var(--danger-light)' },
};

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

export default function AdminDashboard() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onShipmentsSnapshot(data => {
      setShipments(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    getRecentActivity(8).then(setActivity).catch(console.error);
  }, [shipments]);

  const activeShipments = shipments.filter(s => !['delivered', 'cancelled'].includes(s.currentStatus)).length;
  const totalRevenue = shipments.reduce((s, sh) => s + (sh.price || 0), 0);
  const deliveredCount = shipments.filter(s => s.currentStatus === 'delivered').length;
  const unassignedCount = shipments.filter(s => !s.driverName && s.currentStatus === 'pending').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Command Center</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Real-time overview of your logistics operations.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} change={`${shipments.length} shipments`} changeType="positive" icon={<DollarSign className="w-5 h-5" style={{ color: 'var(--orange)' }} />} />
        <StatCard label="Active Shipments" value={activeShipments} change={`${shipments.length} total`} icon={<Package className="w-5 h-5" style={{ color: 'var(--info)' }} />} iconBg="var(--info-light)" />
        <StatCard label="Delivered" value={deliveredCount} change="All time" changeType="positive" icon={<CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />} iconBg="var(--success-light)" />
        <StatCard label="Unassigned" value={unassignedCount} change={unassignedCount > 0 ? 'Needs attention' : 'All assigned'} changeType={unassignedCount > 0 ? 'negative' : 'positive'} icon={<Truck className="w-5 h-5" style={{ color: 'var(--warning)' }} />} iconBg="var(--warning-light)" />
      </div>

      {/* Alert bar */}
      {unassignedCount > 0 && (
        <Link href="/dashboard/admin/loads" className="block p-4 rounded-xl flex items-center gap-3 hover:shadow-md transition-all" style={{ background: 'var(--orange-100)' }}>
          <Activity className="w-5 h-5" style={{ color: 'var(--orange)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{unassignedCount} load{unassignedCount > 1 ? 's' : ''} unassigned</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Go to the Load Board to assign drivers.</p>
          </div>
        </Link>
      )}

      {/* Recent Activity */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 className="w-5 h-5 animate-spin" /> Loading activity...
          </div>
        ) : activity.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No activity yet. Activity will appear here when shipments are booked.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {activity.map((item, i) => {
              const meta = STATUS_ICONS[item.status] || STATUS_ICONS['pending'];
              return (
                <div key={i} className="px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style={{ background: meta.bg }}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        <span className="font-mono text-xs font-medium" style={{ color: 'var(--orange)' }}>{item.waybillNumber}</span>
                        {' '}{item.origin && item.destination ? `${item.origin} → ${item.destination}` : ''}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.note}</p>
                    </div>
                  </div>
                  <p className="text-xs whitespace-nowrap ml-4" style={{ color: 'var(--text-muted)' }}>{timeAgo(item.timestamp)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
