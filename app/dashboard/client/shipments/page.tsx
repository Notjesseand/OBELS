'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate, ShipmentStatus } from '@/lib/utils';
import { onClientShipmentsSnapshot, ShipmentRecord } from '@/lib/tracking';
import { useAuth } from '@/lib/auth-context';
import { Search, Filter, Loader2, Package } from 'lucide-react';
import Link from 'next/link';

export default function ShipmentsPage() {
  const { user, userProfile } = useAuth();
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const email = user?.email || userProfile?.email;
    if (!email) {
      setLoading(false);
      return;
    }
    const unsub = onClientShipmentsSnapshot(email, data => {
      setShipments(data);
      setLoading(false);
    });
    return unsub;
  }, [user, userProfile]);

  const filtered = shipments.filter(s => {
    if (statusFilter !== 'all' && s.currentStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.waybillNumber.toLowerCase().includes(q) && !s.origin.toLowerCase().includes(q) && !s.destination.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Shipments</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Track and manage all your shipments.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by waybill, origin, or destination..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ShipmentStatus | 'all')}
            className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="picked-up">Picked Up</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 className="w-5 h-5 animate-spin" /> Loading your shipments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {shipments.length === 0 ? 'No shipments yet' : 'No matching shipments'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {shipments.length === 0 ? 'Book your first shipment to get started.' : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
            <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-6 py-4">Waybill #</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">ETA</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {filtered.map(s => (
                <tr key={s.waybillNumber} className="border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4 font-mono text-xs font-medium">
                    <Link href={`/dashboard/client/tracking?waybill=${s.waybillNumber}`} className="underline underline-offset-2 transition-all hover:opacity-80" style={{ color: 'var(--orange)' }}>
                      {s.waybillNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.origin} → {s.destination}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ background: s.type === 'FTL' ? 'var(--navy)' : 'var(--info)' }}>{s.type}</span>
                  </td>
                  <td className="px-6 py-4 capitalize">{s.cargoType}</td>
                  <td className="px-6 py-4">{s.weight?.toLocaleString()}kg</td>
                  <td className="px-6 py-4"><StatusBadge status={s.currentStatus} size="sm" /></td>
                  <td className="px-6 py-4">{s.driverName || '—'}</td>
                  <td className="px-6 py-4 text-xs">{s.estimatedDelivery ? formatDate(s.estimatedDelivery) : '—'}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(s.price)}</td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/dashboard/client/tracking?waybill=${s.waybillNumber}`}
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                      style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}
                    >
                      Track Live
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
