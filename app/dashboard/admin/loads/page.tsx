'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { onShipmentsSnapshot, assignDriverToShipment, ShipmentRecord } from '@/lib/tracking';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, CheckCircle, RefreshCw, X } from 'lucide-react';

interface DriverOption {
  uid: string;
  name: string;
  phone: string;
  vehiclePlate: string;
  vehicleType: string;
}

export default function LoadBoardPage() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningWaybill, setAssigningWaybill] = useState<string | null>(null);
  const [reassignWaybill, setReassignWaybill] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onShipmentsSnapshot(data => {
      setShipments(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'driver'));
        const snap = await getDocs(q);
        const driverList = snap.docs.map(d => {
          const data = d.data();
          return {
            uid: d.id,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.displayName || 'Driver',
            phone: data.phone || '—',
            vehiclePlate: data.vehiclePlate || '—',
            vehicleType: data.vehicleType || 'Truck',
          };
        });
        setDrivers(driverList);
      } catch (err) {
        console.error('Failed to fetch drivers:', err);
      }
    }
    fetchDrivers();
  }, []);

  const handleAssign = async (waybillNumber: string, driver: DriverOption) => {
    setAssigningWaybill(waybillNumber);
    try {
      await assignDriverToShipment(
        waybillNumber,
        driver.uid,
        driver.name,
        driver.phone,
        driver.vehiclePlate
      );
      setReassignWaybill(null);
    } catch (err) {
      console.error('Failed to assign driver:', err);
    }
    setAssigningWaybill(null);
  };

  const unassigned = shipments.filter(s => !s.driverName && s.currentStatus === 'pending');
  const assigned = shipments.filter(s => s.driverName);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2" style={{ color: 'var(--text-muted)' }}>
        <Loader2 className="w-5 h-5 animate-spin" /> Loading load board...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Load Board</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Assign drivers to loads and manage dispatching.</p>
      </div>

      {/* Unassigned Loads */}
      {unassigned.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--danger)' }} />
            Unassigned Loads ({unassigned.length})
          </h3>
          <div className="space-y-4">
            {unassigned.map(load => (
              <div key={load.waybillNumber} className="bg-[var(--surface)] rounded-xl border-2 shadow-sm p-6" style={{ borderColor: 'var(--warning)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{load.waybillNumber}</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{load.origin} → {load.destination}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{load.clientName} · {load.weight?.toLocaleString()}kg · {load.cargoType}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={load.currentStatus} />
                    <p className="text-lg font-bold mt-2" style={{ color: 'var(--orange)' }}>{formatCurrency(load.price)}</p>
                  </div>
                </div>

                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Assign a Driver:</h4>
                {drivers.length === 0 ? (
                  <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>No registered drivers found. Drivers need to sign up with the &quot;Driver&quot; role first.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {drivers.map(driver => (
                      <button
                        key={driver.uid}
                        onClick={() => handleAssign(load.waybillNumber, driver)}
                        disabled={assigningWaybill === load.waybillNumber}
                        className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-md transition-all text-left disabled:opacity-50"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--navy)' }}>
                          {driver.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{driver.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{driver.vehicleType} · {driver.vehiclePlate}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {assigningWaybill === load.waybillNumber && (
                  <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'var(--orange)' }}>
                    <Loader2 className="w-4 h-4 animate-spin" /> Assigning driver...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {unassigned.length === 0 && (
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-8 text-center" style={{ borderColor: 'var(--border)' }}>
          <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--success)' }} />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>All caught up!</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>No unassigned loads at the moment.</p>
        </div>
      )}

      {/* Assigned Loads */}
      {assigned.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Assigned Loads ({assigned.length})</h3>
          <div className="space-y-3">
            {assigned.map(s => (
              <div key={s.waybillNumber} className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <div className="p-5">
                  {/* Shipment info row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.waybillNumber}</span>
                        <StatusBadge status={s.currentStatus} size="sm" />
                        <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ background: s.type === 'FTL' ? 'var(--navy)' : 'var(--info)' }}>{s.type}</span>
                      </div>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{s.origin} → {s.destination}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Client: {s.clientName} · {s.weight?.toLocaleString()}kg · {s.cargoType}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-semibold" style={{ color: 'var(--orange)' }}>{formatCurrency(s.price)}</p>
                    </div>
                  </div>

                  {/* Current driver + Reassign button */}
                  <div className="mt-4 flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--slate-50)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--navy)' }}>
                        {(s.driverName || 'D').split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.driverName}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.vehiclePlate || '—'} · {s.driverPhone || '—'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setReassignWaybill(reassignWaybill === s.waybillNumber ? null : s.waybillNumber)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-md"
                      style={{
                        background: reassignWaybill === s.waybillNumber ? 'var(--danger-light)' : 'var(--orange-100)',
                        color: reassignWaybill === s.waybillNumber ? 'var(--danger)' : 'var(--orange)',
                      }}
                    >
                      {reassignWaybill === s.waybillNumber ? (
                        <><X className="w-3.5 h-3.5" /> Cancel</>
                      ) : (
                        <><RefreshCw className="w-3.5 h-3.5" /> Reassign</>
                      )}
                    </button>
                  </div>

                  {/* Inline driver picker for reassignment */}
                  {reassignWaybill === s.waybillNumber && (
                    <div className="mt-3 p-4 rounded-xl border animate-fade-in" style={{ borderColor: 'var(--orange)', background: 'var(--orange-100)' }}>
                      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Select new driver for {s.waybillNumber}:</p>
                      {drivers.filter(d => d.uid !== s.driverUid).length === 0 ? (
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No other drivers available.</p>
                      ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {drivers
                            .filter(d => d.uid !== s.driverUid)
                            .map(driver => (
                              <button
                                key={driver.uid}
                                onClick={() => handleAssign(s.waybillNumber, driver)}
                                disabled={assigningWaybill === s.waybillNumber}
                                className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-md transition-all text-left disabled:opacity-50"
                                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                              >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--navy)' }}>
                                  {driver.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{driver.name}</p>
                                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{driver.vehicleType} · {driver.vehiclePlate}</p>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                      {assigningWaybill === s.waybillNumber && (
                        <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'var(--orange)' }}>
                          <Loader2 className="w-4 h-4 animate-spin" /> Reassigning driver...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
