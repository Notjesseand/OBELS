'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { lookupShipment, getTrackingHistory, TrackingEvent, ShipmentRecord } from '@/lib/tracking';
import { ShipmentStatus, formatDateTime } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import { MapPin, Truck, Clock, Package, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

const STATUS_FLOW: ShipmentStatus[] = ['pending', 'confirmed', 'picked-up', 'in-transit', 'delivered'];

const STATUS_COLORS: Record<string, string> = {
  'pending': 'var(--warning)',
  'confirmed': 'var(--info)',
  'picked-up': '#8b5cf6',
  'in-transit': 'var(--orange)',
  'delivered': 'var(--success)',
  'cancelled': 'var(--danger)',
};

export default function AdminShipmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const waybill = (params.waybill as string)?.toUpperCase();

  const [shipment, setShipment] = useState<ShipmentRecord | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!waybill) return;
    
    const fetchData = async () => {
      try {
        const data = await lookupShipment(waybill);
        if (data) {
          setShipment(data);
          const history = await getTrackingHistory(waybill);
          setEvents(history);
        } else {
          setError('Shipment not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading shipment details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [waybill]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--orange)' }} />
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-red-500 mb-6">{error || 'Shipment not found.'}</p>
        <button 
          onClick={() => router.back()} 
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ borderColor: 'var(--border)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </button>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Shipment Details</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Detailed view for waybill {waybill}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-[var(--surface)] p-6 rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Waybill Number</p>
                <p className="font-mono text-2xl font-bold uppercase" style={{ color: 'var(--orange)' }}>{shipment.waybillNumber}</p>
              </div>
              <StatusBadge status={shipment.currentStatus} />
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs flex items-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-4 h-4" style={{ color: 'var(--orange)' }} /> Origin
                  </p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{shipment.origin}</p>
                </div>
                <div>
                  <p className="text-xs flex items-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-4 h-4" style={{ color: 'var(--success)' }} /> Destination
                  </p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{shipment.destination}</p>
                </div>
                <div>
                  <p className="text-xs flex items-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-4 h-4" style={{ color: 'var(--info)' }} /> Estimated Delivery
                  </p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{shipment.estimatedDelivery}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs flex items-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
                    <Package className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} /> Cargo Details
                  </p>
                  <p className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                    {shipment.cargoType} · {shipment.weight?.toLocaleString()}kg · {shipment.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs flex items-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
                    <Truck className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} /> Driver Assigned
                  </p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{shipment.driverName || 'Not assigned yet'}</p>
                  {shipment.driverPhone && (
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>📞 {shipment.driverPhone}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs flex items-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
                    Client
                  </p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{shipment.clientName}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{shipment.clientEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="bg-[var(--surface)] p-6 rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Delivery Progress</h3>
            <div className="flex items-center gap-2 mb-8">
              {STATUS_FLOW.map((st, i) => {
                const currentIdx = STATUS_FLOW.indexOf(shipment.currentStatus);
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
                    {i < STATUS_FLOW.length - 1 && (
                      <div className="flex-1 h-0.5" style={{ background: i < currentIdx ? 'var(--success)' : 'var(--border)' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tracking Events Timeline */}
            <div className="space-y-0 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Detailed Timeline</h4>
              {events.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No tracking events recorded.</p>
              ) : (
                events.map((event, i) => {
                  const dateInfo = event.timestamp ? (event.timestamp as any).toDate ? (event.timestamp as any).toDate() : new Date(event.timestamp as any) : null;
                  return (
                    <div key={event.id || i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{
                          background: STATUS_COLORS[event.status] || 'var(--border)',
                          boxShadow: `0 0 0 4px ${STATUS_COLORS[event.status]}20`,
                        }} />
                        {i < events.length - 1 && (
                          <div className="flex-1 w-0.5 mt-1" style={{ background: 'var(--border)' }} />
                        )}
                      </div>
                      <div className="pb-6">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                            {event.status.replace('-', ' ')}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            background: `${STATUS_COLORS[event.status]}20`,
                            color: STATUS_COLORS[event.status],
                          }}>
                            {event.driverName}
                          </span>
                        </div>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                          {dateInfo ? formatDateTime(dateInfo) : ''}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{event.note}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-[var(--surface)] p-6 rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Admin Actions</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              As an administrator, you can view the full tracking history and details of this shipment.
            </p>
            {shipment.currentStatus !== 'delivered' && shipment.currentStatus !== 'cancelled' && (
              <button 
                className="w-full py-2.5 rounded-xl border border-dashed text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                onClick={() => router.push('/dashboard/admin/loads')}
              >
                Manage in Load Board
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
