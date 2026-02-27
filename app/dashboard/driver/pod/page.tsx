'use client';

import { useState } from 'react';
import { Camera, Upload, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface PODEntry {
  waybill: string;
  route: string;
  photo: string;
  notes: string;
  time: string;
}

export default function ProofOfDeliveryPage() {
  const [entries, setEntries] = useState<PODEntry[]>([
    { waybill: 'WB260207G7H8', route: 'Lagos → Enugu', photo: 'pod_photo_1.jpg', notes: 'Delivered to warehouse manager Mr. Nwoye. All 150 cartons intact.', time: '19 Feb 2026, 14:00' },
  ]);
  const [notes, setNotes] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setEntries(prev => [{
      waybill: 'WB260201A1B2',
      route: 'Lagos → Abuja',
      photo: 'pod_photo_2.jpg',
      notes: notes || 'Delivered successfully. No damage reported.',
      time: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }, ...prev]);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Proof of Delivery</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Upload photos and notes to confirm deliveries.</p>
      </div>

      {/* Upload Form */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--success)' }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>POD Submitted!</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Proof of delivery has been recorded for WB260201A1B2.</p>
            <button onClick={() => { setSubmitted(false); setUploaded(false); setNotes(''); }} className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: 'var(--border)' }}>Submit Another</button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Submit New POD</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Shipment</label>
              <select className="w-full px-4 py-3 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)' }}>
                <option>WB260201A1B2 — Lagos → Abuja (In-transit)</option>
              </select>
            </div>

            {/* Photo Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Delivery Photo</label>
              {uploaded ? (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--success-light)' }}>
                  <ImageIcon className="w-5 h-5" style={{ color: 'var(--success)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>delivery_photo.jpg uploaded</span>
                </div>
              ) : (
                <button
                  onClick={() => setUploaded(true)}
                  className="w-full flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all hover:border-orange hover:bg-orange-100/50 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--orange-100)' }}>
                    <Camera className="w-6 h-6" style={{ color: 'var(--orange)' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Click to upload delivery photo</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PNG, JPG up to 10MB</p>
                  </div>
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Delivery Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Receiver name, condition of goods, etc."
                className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}
              />
            </div>

            <button onClick={handleSubmit} disabled={!uploaded} className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50" style={{ background: 'var(--orange)' }}>
              <Upload className="w-4 h-4 inline mr-2" /> Submit Proof of Delivery
            </button>
          </>
        )}
      </div>

      {/* History */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>POD History</h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {entries.map((e, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--success-light)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{e.waybill} — {e.route}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{e.notes}</p>
                </div>
              </div>
              <p className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{e.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
