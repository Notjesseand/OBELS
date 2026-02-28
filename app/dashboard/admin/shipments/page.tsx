'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate, ShipmentStatus } from '@/lib/utils';
import { onShipmentsSnapshot, ShipmentRecord } from '@/lib/tracking';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onShipmentsSnapshot(data => {
      setShipments(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>All Shipments</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage every shipment across the platform.</p>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 className="w-5 h-5 animate-spin" /> Loading shipments...
          </div>
        ) : shipments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No shipments found yet. Bookings will appear here.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-6 py-4">Waybill</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">ETA</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {shipments.map(s => (
                <tr key={s.waybillNumber} className="border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4 font-mono text-xs font-medium">
                    <Link href={`/dashboard/admin/shipments/${s.waybillNumber}`} className="underline underline-offset-2 transition-all hover:opacity-80" style={{ color: 'var(--orange)' }}>
                      {s.waybillNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{s.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.origin} → {s.destination}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ background: s.type === 'FTL' ? 'var(--navy)' : 'var(--info)' }}>{s.type}</span>
                  </td>
                  <td className="px-6 py-4">{s.weight?.toLocaleString()}kg</td>
                  <td className="px-6 py-4">{s.driverName || '—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.currentStatus} size="sm" /></td>
                  <td className="px-6 py-4 text-xs">{s.estimatedDelivery ? formatDate(s.estimatedDelivery) : '—'}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(s.price)}</td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/dashboard/admin/shipments/${s.waybillNumber}`}
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                      style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}
                    >
                      View Details
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
