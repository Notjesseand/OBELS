'use client';

import { useState } from 'react';
import { calculatePrice, getDistance, getAvailableCities } from '@/lib/pricing';
import { formatCurrency, CargoType, getCargoLabel } from '@/lib/utils';
import { Calculator, ArrowRight, Truck } from 'lucide-react';
import Link from 'next/link';

export default function QuotePage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [cargoType, setCargoType] = useState<CargoType>('general');
  const [shipmentType, setShipmentType] = useState<'FTL' | 'LTL'>('FTL');
  const [result, setResult] = useState<ReturnType<typeof calculatePrice> | null>(null);
  const cities = getAvailableCities();

  const handleCalculate = () => {
    const dist = getDistance(origin, destination);
    if (!dist || !weight) return;
    setResult(calculatePrice(dist, parseFloat(weight), cargoType, shipmentType === 'LTL'));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Request a Quote</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Get an instant price estimate for your shipment.</p>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        {/* Type Toggle */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: 'var(--slate-100)' }}>
          {(['FTL', 'LTL'] as const).map(t => (
            <button key={t} onClick={() => setShipmentType(t)} className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: shipmentType === t ? 'var(--surface)' : 'transparent', color: shipmentType === t ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: shipmentType === t ? 'var(--shadow-sm)' : 'none' }}>
              {t === 'FTL' ? 'Full Truckload' : 'Less-Than-Truckload'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Origin</label>
            <select value={origin} onChange={e => setOrigin(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}>
              <option value="">Select origin</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Destination</label>
            <select value={destination} onChange={e => setDestination(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}>
              <option value="">Select destination</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Weight (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 5000" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Cargo Type</label>
            <select value={cargoType} onChange={e => setCargoType(e.target.value as CargoType)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}>
              {(['general', 'fragile', 'perishable', 'hazardous', 'livestock', 'machinery'] as CargoType[]).map(t => (
                <option key={t} value={t}>{getCargoLabel(t)}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleCalculate} disabled={!origin || !destination || !weight} className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50" style={{ background: 'var(--orange)' }}>
          <Calculator className="w-4 h-4 inline mr-2" /> Calculate Price
        </button>

        {result && (
          <div className="mt-6 p-6 rounded-xl animate-fade-in" style={{ background: 'var(--navy)', color: 'white' }}>
            <p className="text-sm text-white/60 mb-1">Estimated Price ({shipmentType})</p>
            <p className="text-4xl font-black mb-4" style={{ color: 'var(--orange)' }}>{formatCurrency(result.total)}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div><p className="text-white/40">Base</p><p className="font-semibold">{formatCurrency(result.baseCost)}</p></div>
              <div><p className="text-white/40">Distance</p><p className="font-semibold">{formatCurrency(result.distanceCost)}</p></div>
              <div><p className="text-white/40">Weight</p><p className="font-semibold">{formatCurrency(result.weightCost)}</p></div>
              <div><p className="text-white/40">VAT (7.5%)</p><p className="font-semibold">{formatCurrency(result.vat)}</p></div>
            </div>
            <Link href="/dashboard/client/book" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
              <Truck className="w-4 h-4" /> Book This Shipment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
