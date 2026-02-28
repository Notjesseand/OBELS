'use client';

import { useState } from 'react';
import { calculatePrice, getDistance, getAvailableCities } from '@/lib/pricing';
import { formatCurrency, CargoType, getCargoLabel, generateWaybillNumber } from '@/lib/utils';
import { Truck, Package, CheckCircle, Loader2 } from 'lucide-react';
import { createShipmentRecord } from '@/lib/tracking';
import { useAuth } from '@/lib/auth-context';

export default function BookShipmentPage() {
  const { userProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [shipmentType, setShipmentType] = useState<'FTL' | 'LTL'>('LTL');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [cargoType, setCargoType] = useState<CargoType>('general');
  const [description, setDescription] = useState('');
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [waybillNumber, setWaybillNumber] = useState('');
  const cities = getAvailableCities();

  const dist = getDistance(origin, destination);
  const price = dist && weight ? calculatePrice(dist, parseFloat(weight), cargoType, shipmentType === 'LTL') : null;

  const inputStyle = { borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties;

  if (booked) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--success-light)' }}>
          <CheckCircle className="w-10 h-10" style={{ color: 'var(--success)' }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Shipment Booked!</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Your shipment has been confirmed. We&apos;ll assign a driver shortly.</p>
        <p className="text-xs font-mono px-4 py-2 rounded-lg inline-block mb-6" style={{ background: 'var(--slate-100)', color: 'var(--text-primary)' }}>
          Waybill: {waybillNumber}
        </p>
        <div className="flex gap-3 justify-center">
          <a href="/dashboard/client/shipments" className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: 'var(--orange)' }}>View Shipments</a>
          <button onClick={() => { setBooked(false); setStep(1); }} className="px-6 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>Book Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Book a Shipment</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Fill in the details below to book your freight.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: step >= s ? 'var(--orange)' : 'var(--slate-200)', color: step >= s ? 'white' : 'var(--text-muted)' }}>{s}</div>
            <span className="text-xs font-medium hidden sm:block" style={{ color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {s === 1 ? 'Details' : s === 2 ? 'Review' : 'Confirm'}
            </span>
            {s < 3 && <div className="flex-1 h-0.5 rounded" style={{ background: step > s ? 'var(--orange)' : 'var(--slate-200)' }} />}
          </div>
        ))}
      </div>

      <div className="max-w-3xl bg-[var(--surface)] rounded-xl border shadow-sm p-6 mx-auto" style={{ borderColor: 'var(--border)' }}>
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex rounded-xl p-1" style={{ background: 'var(--slate-100)' }}>
              <button onClick={() => setShipmentType('FTL')} className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all" style={{ background: shipmentType === 'FTL' ? 'var(--surface)' : 'transparent', color: shipmentType === 'FTL' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <Truck className="w-4 h-4" /> Full Truckload
              </button>
              <button onClick={() => setShipmentType('LTL')} className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all" style={{ background: shipmentType === 'LTL' ? 'var(--surface)' : 'transparent', color: shipmentType === 'LTL' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <Package className="w-4 h-4" /> Less-Than-Truckload
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Pickup City</label>
                <select value={origin} onChange={e => setOrigin(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={inputStyle}>
                  <option value="">Select city</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Delivery City</label>
                <select value={destination} onChange={e => setDestination(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={inputStyle}>
                  <option value="">Select city</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 5000" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Cargo Type</label>
                <select value={cargoType} onChange={e => setCargoType(e.target.value as CargoType)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={inputStyle}>
                  {(['general', 'fragile', 'perishable', 'hazardous', 'livestock', 'machinery'] as CargoType[]).map(t => <option key={t} value={t}>{getCargoLabel(t)}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description (optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Any special instructions..." className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none" style={inputStyle} />
            </div>

            <button onClick={() => setStep(2)} disabled={!origin || !destination || !weight} className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50" style={{ background: 'var(--orange)' }}>
              Continue to Review
            </button>
          </div>
        )}

        {step === 2 && price && (
          <div className="space-y-5">
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Review Your Booking</h3>
            <div className="space-y-3">
              {[
                ['Route', `${origin} → ${destination}`],
                ['Distance', `${dist} km`],
                ['Shipment Type', shipmentType === 'FTL' ? 'Full Truckload' : 'Less-Than-Truckload'],
                ['Cargo Type', getCargoLabel(cargoType)],
                ['Weight', `${parseFloat(weight).toLocaleString()} kg`],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between py-2 border-b text-sm" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--orange-100)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Price</p>
              <p className="text-3xl font-black" style={{ color: 'var(--orange)' }}>{formatCurrency(price.total)}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Incl. ₦{price.vat.toLocaleString()} VAT</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>Back</button>
              <button
                disabled={booking}
                onClick={async () => {
                  setBooking(true);
                  const wb = generateWaybillNumber();
                  setWaybillNumber(wb);
                  try {
                    await createShipmentRecord(wb, {
                      clientName: userProfile?.firstName
                        ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim()
                        : userProfile?.companyName || 'Client',
                      clientEmail: userProfile?.email || '',
                      clientUid: userProfile?.uid || '',
                      origin,
                      destination,
                      cargoType,
                      weight: parseFloat(weight),
                      type: shipmentType,
                      price: price!.total,
                      driverName: null,
                      driverPhone: null,
                      driverUid: null,
                      vehiclePlate: null,
                      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
                    });
                  } catch (err) {
                    console.error('Failed to create shipment in Firestore:', err);
                  }
                  setBooking(false);
                  setBooked(true);
                }}
                className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: 'var(--orange)' }}
              >
                {booking ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : 'Confirm and Book'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
