'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate, ShipmentStatus } from '@/lib/utils';
import { ArrowRight, CheckCircle, Loader2, Package } from 'lucide-react';
import { onDriverShipmentsSnapshot, recordStatusUpdate, ShipmentRecord } from '@/lib/tracking';
import { useAuth } from '@/lib/auth-context';

const STATUS_FLOW: ShipmentStatus[] = ['confirmed', 'picked-up', 'in-transit', 'delivered'];

export default function TripsPage() {
  const { user, userProfile } = useAuth();
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingWaybill, setUpdatingWaybill] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    const unsub = onDriverShipmentsSnapshot(user.uid, data => {
      setShipments(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const advanceStatus = async (waybillNumber: string, currentStatus: ShipmentStatus) => {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    const newStatus = STATUS_FLOW[idx + 1];
    setUpdatingWaybill(waybillNumber);
    try {
      await recordStatusUpdate(
        waybillNumber,
        newStatus,
        user?.uid || 'driver',
        userProfile?.firstName
          ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim()
          : 'Driver'
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
    setUpdatingWaybill(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2" style={{ color: 'var(--text-muted)' }}>
        <Loader2 className="w-5 h-5 animate-spin" /> Loading your trips...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Trips</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>View your assigned trips and update delivery statuses.</p>
      </div>

      {shipments.length === 0 ? (
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-12 text-center" style={{ borderColor: 'var(--border)' }}>
          <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No trips assigned yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>When admin assigns you a shipment, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map(trip => {
            const currentIdx = STATUS_FLOW.indexOf(trip.currentStatus);
            const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

            return (
              <div key={trip.waybillNumber} className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-mono text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{trip.waybillNumber}</p>
                      <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{trip.origin} → {trip.destination}</p>
                    </div>
                    <StatusBadge status={trip.currentStatus} />
                  </div>

                  <div className="grid md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Client</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{trip.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cargo</p>
                      <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{trip.cargoType}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Weight</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{trip.weight?.toLocaleString()}kg</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ETA</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{trip.estimatedDelivery ? formatDate(trip.estimatedDelivery) : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Value</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(trip.price)}</p>
                    </div>
                  </div>

                  {/* Status Progress */}
                  <div className="flex items-center gap-2 mb-4">
                    {STATUS_FLOW.map((st, i) => {
                      const done = i <= currentIdx;
                      return (
                        <div key={st} className="flex items-center gap-2 flex-1">
                          <div className="flex items-center gap-1.5">
                            {done ? (
                              <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: 'var(--border)' }} />
                            )}
                            <span className="text-xs font-medium capitalize hidden sm:inline" style={{ color: done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                              {st.replace('-', ' ')}
                            </span>
                          </div>
                          {i < STATUS_FLOW.length - 1 && <div className="flex-1 h-0.5" style={{ background: i < currentIdx ? 'var(--success)' : 'var(--border)' }} />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Action */}
                  {nextStatus && (
                    <button
                      onClick={() => advanceStatus(trip.waybillNumber, trip.currentStatus)}
                      disabled={updatingWaybill === trip.waybillNumber}
                      className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-60"
                      style={{ background: 'var(--orange)' }}
                    >
                      {updatingWaybill === trip.waybillNumber ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                      ) : (
                        <>Mark as {nextStatus.replace('-', ' ')} <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                  {trip.currentStatus === 'delivered' && (
                    <span className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--success)' }}>
                      <CheckCircle className="w-4 h-4" /> Delivery Complete
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
