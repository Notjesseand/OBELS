'use client';

import { useEffect, useState } from 'react';
import { mockShipments } from '@/lib/mock-data';
import StatusBadge from '@/components/ui/StatusBadge';
import { MapPin, Truck, Clock, Phone, Search, Package, CheckCircle, Loader2 } from 'lucide-react';
import { ShipmentStatus, formatDateTime } from '@/lib/utils';
import { lookupShipment, getTrackingHistory, TrackingEvent, ShipmentRecord } from '@/lib/tracking';
import { Timestamp } from 'firebase/firestore';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

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

export default function TrackingPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState(mockShipments[0].id);

  // Waybill lookup state
  const [waybillInput, setWaybillInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState<ShipmentRecord | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    setMounted(true);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

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

  const activeShipments = mockShipments.filter(s => ['in-transit', 'picked-up', 'confirmed'].includes(s.status));
  const selected = mockShipments.find(s => s.id === selectedId) || activeShipments[0];

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

      {/* Active Shipments + Map */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-[var(--surface)] rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)', height: '500px' }}>
          {mounted ? (
            <MapContainer
              center={[selected.lat, selected.lng]}
              zoom={7}
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {activeShipments.map(s => (
                <Marker key={s.id} position={[s.lat, s.lng]}>
                  <Popup>
                    <div className="text-xs">
                      <p className="font-bold">{s.waybillNumber}</p>
                      <p>{s.origin} → {s.destination}</p>
                      <p className="capitalize">{s.status}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full" style={{ background: 'var(--slate-50)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading map...</p>
            </div>
          )}
        </div>

        {/* Shipment List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Active Shipments ({activeShipments.length})</h3>
          {activeShipments.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className="w-full text-left p-4 rounded-xl border transition-all hover:shadow-md"
              style={{
                borderColor: selectedId === s.id ? 'var(--orange)' : 'var(--border)',
                background: selectedId === s.id ? 'var(--orange-100)' : 'var(--surface)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{s.waybillNumber}</span>
                <StatusBadge status={s.status} size="sm" />
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
          ))}
        </div>
      </div>

      {/* Selected detail */}
      {selected && (
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Shipment Details — {selected.waybillNumber}</h3>
          <div className="grid md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{new Date(selected.estimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
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
        </div>
      )}
    </div>
  );
}
