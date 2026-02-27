'use client';

import { useState } from 'react';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';

export default function PaymentPage() {
  const [gateway, setGateway] = useState<'paystack' | 'flutterwave'>('paystack');
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [paid, setPaid] = useState(false);

  if (paid) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--success-light)' }}>
          <CheckCircle className="w-10 h-10" style={{ color: 'var(--success)' }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Payment Successful!</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Your payment has been processed via {gateway === 'paystack' ? 'Paystack' : 'Flutterwave'}. A receipt has been sent to your email.</p>
        <a href="/dashboard/client/invoices" className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: 'var(--orange)' }}>View Invoices</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Make Payment</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Pay outstanding invoices using Paystack or Flutterwave.</p>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        {/* Gateway Selection */}
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Select Payment Gateway</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setGateway('paystack')}
            className="p-5 rounded-xl border-2 text-center transition-all"
            style={{ borderColor: gateway === 'paystack' ? 'var(--orange)' : 'var(--border)', background: gateway === 'paystack' ? 'var(--orange-100)' : 'var(--surface)' }}
          >
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: '#00C3F7' }}>
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Paystack</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Cards, Bank, USSD</p>
          </button>
          <button
            onClick={() => setGateway('flutterwave')}
            className="p-5 rounded-xl border-2 text-center transition-all"
            style={{ borderColor: gateway === 'flutterwave' ? 'var(--orange)' : 'var(--border)', background: gateway === 'flutterwave' ? 'var(--orange-100)' : 'var(--surface)' }}
          >
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: '#F5A623' }}>
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Flutterwave</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Cards, Mobile, Transfer</p>
          </button>
        </div>

        {/* Currency */}
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Currency</h3>
        <div className="flex rounded-xl p-1 mb-6" style={{ background: 'var(--slate-100)' }}>
          {(['NGN', 'USD'] as const).map(c => (
            <button key={c} onClick={() => setCurrency(c)} className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: currency === c ? 'var(--surface)' : 'transparent', color: currency === c ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {c === 'NGN' ? '🇳🇬 Nigerian Naira (₦)' : '🇺🇸 US Dollar ($)'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{currency === 'NGN' ? '₦' : '$'}</span>
            <input type="number" defaultValue={currency === 'NGN' ? 485000 : 320} className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 p-3 rounded-lg mb-6" style={{ background: 'var(--success-light)' }}>
          <Shield className="w-4 h-4" style={{ color: 'var(--success)' }} />
          <p className="text-xs" style={{ color: 'var(--success)' }}>Your payment is secured with 256-bit SSL encryption</p>
        </div>

        <button onClick={() => setPaid(true)} className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
          Pay with {gateway === 'paystack' ? 'Paystack' : 'Flutterwave'}
        </button>
      </div>
    </div>
  );
}
