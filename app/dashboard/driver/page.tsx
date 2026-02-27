'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate, ShipmentStatus } from '@/lib/utils';
import { Truck, MapPin, DollarSign, ArrowRight, Loader2, Package } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { onDriverShipmentsSnapshot, getRecentActivity, ShipmentRecord, ActivityItem } from '@/lib/tracking';
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

export default function DriverDashboard() {
  const { user, userProfile } = useAuth();
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    const unsub = onDriverShipmentsSnapshot(user.uid, data => {
      setShipments(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  // Fetch activity for driver's shipments
  useEffect(() => {
    if (shipments.length === 0) return;
    getRecentActivity(20).then(allActivity => {
      const myWaybills = new Set(shipments.map(s => s.waybillNumber));
      setActivity(allActivity.filter(a => myWaybills.has(a.waybillNumber)).slice(0, 6));
    }).catch(console.error);
  }, [shipments]);

  const activeTrips = shipments.filter(s => !['delivered', 'cancelled'].includes(s.currentStatus));
  const deliveredCount = shipments.filter(s => s.currentStatus === 'delivered').length;
  const totalEarnings = shipments.reduce((sum, s) => sum + (s.price || 0), 0);
  const activeTrip = shipments.find(s => ['in-transit', 'picked-up'].includes(s.currentStatus));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome back, {userProfile?.firstName || 'Driver'} 🚛</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Here&apos;s your driving activity overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Trips" value={activeTrips.length} icon={<Truck className="w-5 h-5" style={{ color: 'var(--orange)' }} />} />
        <StatCard label="Completed" value={deliveredCount} change="All time" changeType="positive" icon={<MapPin className="w-5 h-5" style={{ color: 'var(--success)' }} />} iconBg="var(--success-light)" />
        <StatCard label="Total Shipments" value={shipments.length} icon={<Package className="w-5 h-5" style={{ color: 'var(--info)' }} />} iconBg="var(--info-light)" />
        <StatCard label="Earnings" value={formatCurrency(totalEarnings)} icon={<DollarSign className="w-5 h-5" style={{ color: 'var(--warning)' }} />} iconBg="var(--warning-light)" />
      </div>

      {/* Active Trip */}
      {activeTrip && (
        <div className="rounded-xl border-2 p-6 relative overflow-hidden bg-[var(--surface)]" style={{ borderColor: 'var(--orange)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10" style={{ background: 'var(--orange)' }} />
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white animate-pulse-orange" style={{ background: 'var(--orange)' }}>ACTIVE TRIP</span>
            <StatusBadge status={activeTrip.currentStatus} size="sm" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Waybill</p>
              <p className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{activeTrip.waybillNumber}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Route</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{activeTrip.origin} → {activeTrip.destination}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Cargo</p>
              <p className="text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>{activeTrip.cargoType} · {activeTrip.weight?.toLocaleString()}kg</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>ETA</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{activeTrip.estimatedDelivery ? formatDate(activeTrip.estimatedDelivery) : '—'}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/driver/trips" className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
              Update Status <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity + Trips List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2" style={{ color: 'var(--text-muted)' }}>
              <Loader2 className="w-5 h-5 animate-spin" /> Loading...
            </div>
          ) : activity.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No activity yet. You&apos;ll see updates once you have assigned trips.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {activity.map((item, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center justify-between">
                  <div className="min-w-0 mr-3">
                    <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      <span className="font-mono text-xs" style={{ color: 'var(--orange)' }}>{item.waybillNumber}</span>
                      {' '}{item.origin} → {item.destination}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.note}</p>
                  </div>
                  <p className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{timeAgo(item.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trips list */}
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>My Trips</h3>
            <Link href="/dashboard/driver/trips" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--orange)' }}>View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {shipments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No trips assigned yet.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {shipments.slice(0, 5).map(trip => (
                <div key={trip.waybillNumber} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: trip.currentStatus === 'delivered' ? 'var(--success-light)' : 'var(--orange-100)' }}>
                      {trip.currentStatus === 'delivered' ? <MapPin className="w-5 h-5" style={{ color: 'var(--success)' }} /> : <Truck className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{trip.origin} → {trip.destination}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{trip.waybillNumber} · {trip.weight?.toLocaleString()}kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={trip.currentStatus} size="sm" />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(trip.price)}</span>
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
