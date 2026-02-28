'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams } from 'next/navigation';
import StatusBadge from '@/components/ui/StatusBadge';
import { MapPin, Truck, Clock, Phone, Search, Package, CheckCircle, Loader2, Navigation } from 'lucide-react';
import { ShipmentStatus, formatDateTime } from '@/lib/utils';
import { lookupShipment, getTrackingHistory, TrackingEvent, ShipmentRecord, onClientShipmentsSnapshot } from '@/lib/tracking';
import { Timestamp } from 'firebase/firestore';

const STATUS_FLOW: ShipmentStatus[] = ['pending', 'confirmed', 'picked-up', 'in-transit', 'delivered'];

const STATUS_COLORS: Record<string, string> = {
  'pending': 'var(--warning)',
  'confirmed': 'var(--info)',
  'picked-up': '#8b5cf6',
  'in-transit': 'var(--orange)',
  'delivered': 'var(--success)',
  'cancelled': 'var(--danger)',
};

function formatTimestamp(ts: Timestamp | Date | undefined): string {
  if (!ts) return '';
  const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
  return formatDateTime(date);
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialWaybill = searchParams.get('waybill') || '';

  const { userProfile } = useAuth();
  const [activeShipments, setActiveShipments] = useState<ShipmentRecord[]>([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Waybill lookup state
  const [waybillInput, setWaybillInput] = useState(initialWaybill);
  const [searching, setSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState<ShipmentRecord | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [lookupError, setLookupError] = useState('');
  
  // Try initial waybill search if provided
  useEffect(() => {
    if (initialWaybill) {
      const doInitialSearch = async () => {
        setSearching(true);
        try {
          const shipment = await lookupShipment(initialWaybill.toUpperCase());
          if (shipment) {
            setLookupResult(shipment);
            const events = await getTrackingHistory(initialWaybill.toUpperCase());
            setTrackingEvents(events);
          } else {
            setLookupError('No shipment found with this waybill number.');
          }
        } catch (err) {
          console.error(err);
        }
        setSearching(false);
      };
      doInitialSearch();
    }
  }, [initialWaybill]);

  // Fetch real client shipments
  useEffect(() => {
    if (userProfile?.role === 'client' && userProfile.email) {
      const unsub = onClientShipmentsSnapshot(userProfile.email, (data) => {
        // Filter out completely delivered/cancelled if we only want "active"
        // But let's show all or just non-delivered ones here
        const active = data.filter(s => !['delivered', 'cancelled'].includes(s.currentStatus));
        setActiveShipments(active);
        
        if (active.length > 0 && !selectedId) {
          setSelectedId(active[0].waybillNumber);
        } else if (active.length === 0) {
          setSelectedId(null);
        }
        
        setLoadingActive(false);
      });
      return () => unsub();
    } else if (userProfile) {
      setLoadingActive(false);
    }
  }, [userProfile, selectedId]);

  const handleWaybillLookup = async () => {
    const waybill = waybillInput.trim().toUpperCase();
    if (!waybill) return;

    setSearching(true);
    setLookupError('');
    setLookupResult(null);
    setTrackingEvents([]);

    try {
      const shipment = await lookupShipment(waybill);
      if (shipment) {
        setLookupResult(shipment);
        const events = await getTrackingHistory(waybill);
        setTrackingEvents(events);
      } else {
        setLookupError('No shipment found with this waybill number. Please check and try again.');
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setLookupError('An error occurred while looking up the shipment. Please try again.');
    }

    setSearching(false);
  };

  const selected = activeShipments.find(s => s.waybillNumber === selectedId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Live Tracking</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Monitor your active shipments and track by waybill number.</p>
      </div>

      {/* Waybill Lookup */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Search className="w-5 h-5" style={{ color: 'var(--orange)' }} />
          Track by Waybill Number
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={waybillInput}
            onChange={e => setWaybillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleWaybillLookup()}
            placeholder="Enter waybill number, e.g. WB260201A1B2"
            className="flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}
          />
          <button
            onClick={handleWaybillLookup}
            disabled={searching || !waybillInput.trim()}
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
            style={{ background: 'var(--orange)' }}
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Track
          </button>
        </div>

        {lookupError && (
          <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
            {lookupError}
          </div>
        )}

        {/* Tracking Result */}
        {lookupResult && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Shipment Summary */}
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{lookupResult.waybillNumber}</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{lookupResult.origin} → {lookupResult.destination}</p>
                </div>
                <StatusBadge status={lookupResult.currentStatus} />
              </div>
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Client</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lookupResult.clientName}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cargo</p>
                  <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{lookupResult.cargoType}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Weight</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lookupResult.weight?.toLocaleString()}kg</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Driver</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lookupResult.driverName || 'Not assigned'}</p>
                </div>
              </div>
            </div>

            {/* Status Progress Bar */}
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Delivery Progress</h4>
              <div className="flex items-center gap-2">
                {STATUS_FLOW.map((st, i) => {
                  const currentIdx = STATUS_FLOW.indexOf(lookupResult.currentStatus);
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
            </div>

            {/* Timeline */}
            {trackingEvents.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Tracking Timeline</h4>
                <div className="space-y-0">
                  {trackingEvents.map((event, i) => (
                    <div key={event.id || i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{
                          background: STATUS_COLORS[event.status] || 'var(--border)',
                          boxShadow: `0 0 0 4px ${STATUS_COLORS[event.status]}20`,
                        }} />
                        {i < trackingEvents.length - 1 && (
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
                          {formatTimestamp(event.timestamp)}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{event.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trackingEvents.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No tracking events recorded yet for this shipment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Shipments */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Shipment List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto lg:col-span-1">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Your Active Shipments ({activeShipments.length})</h3>
          
          {loadingActive ? (
            <div className="p-8 flex justify-center border rounded-xl" style={{ borderColor: 'var(--border)' }}>
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : activeShipments.length === 0 ? (
            <div className="p-8 text-center border rounded-xl" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">No active shipments.</p>
            </div>
          ) : (
            activeShipments.map(s => (
              <button
                key={s.waybillNumber}
                onClick={() => setSelectedId(s.waybillNumber)}
                className="w-full text-left p-4 rounded-xl border transition-all hover:shadow-md"
                style={{
                  borderColor: selectedId === s.waybillNumber ? 'var(--orange)' : 'var(--border)',
                  background: selectedId === s.waybillNumber ? 'var(--orange-100)' : 'var(--surface)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{s.waybillNumber}</span>
                  <StatusBadge status={s.currentStatus} size="sm" />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  <MapPin className="w-3.5 h-3.5 inline mr-1" style={{ color: 'var(--orange)' }} />
                  {s.origin} → {s.destination}
                </p>
                {s.driverName && (
                  <p className="text-xs flex items-center gap-1 mt-2" style={{ color: 'var(--text-muted)' }}>
                    <Truck className="w-3 h-3" /> {s.driverName}
                  </p>
                )}
              </button>
            ))
          )}
        </div>

        {/* Selected detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Shipment Details — {selected.waybillNumber}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--orange)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Route</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selected.origin} → {selected.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-0.5" style={{ color: 'var(--info)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ETA</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {selected.estimatedDelivery}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 mt-0.5" style={{ color: 'var(--success)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Driver</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selected.driverName || 'Not assigned'}</p>
                  </div>
                </div>
                {selected.driverPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5" style={{ color: 'var(--warning)' }} />
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Driver Phone</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selected.driverPhone}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                {/* Embedded quick-track button for active shipments */}
                <button
                  onClick={() => {
                    setWaybillInput(selected.waybillNumber);
                    handleWaybillLookup();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all hover:shadow-md"
                  style={{ borderColor: 'var(--border)', color: 'var(--orange)' }}
                >
                  <Navigation className="w-4 h-4" />
                  View Full Tracking Timeline
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--surface)] rounded-xl border border-dashed flex items-center justify-center p-12 text-center" style={{ borderColor: 'var(--border)' }}>
              <div>
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: 'var(--text-primary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select an active shipment from the list to view its details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500 animate-pulse">Loading tracking data...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
