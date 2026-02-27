'use client';

import { formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

const earningsData = [
  { month: 'Sep 2025', trips: 18, amount: 680000 },
  { month: 'Oct 2025', trips: 22, amount: 820000 },
  { month: 'Nov 2025', trips: 25, amount: 950000 },
  { month: 'Dec 2025', trips: 20, amount: 780000 },
  { month: 'Jan 2026', trips: 24, amount: 910000 },
  { month: 'Feb 2026', trips: 12, amount: 480000 },
];

const recentPayouts = [
  { date: '20 Feb 2026', amount: 320000, ref: 'PAY-2026-089', status: 'completed' },
  { date: '5 Feb 2026', amount: 160000, ref: 'PAY-2026-072', status: 'completed' },
  { date: '20 Jan 2026', amount: 450000, ref: 'PAY-2026-055', status: 'completed' },
  { date: '5 Jan 2026', amount: 460000, ref: 'PAY-2026-038', status: 'completed' },
];

export default function EarningsPage() {
  const totalEarnings = earningsData.reduce((s, e) => s + e.amount, 0);
  const thisMonth = earningsData[earningsData.length - 1];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Earnings</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Track your income and payout history.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--orange-100)' }}>
              <DollarSign className="w-5 h-5" style={{ color: 'var(--orange)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Earnings</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(totalEarnings)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Last 6 months</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--success-light)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--success)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>This Month</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(thisMonth.amount)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{thisMonth.trips} trips completed</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--info-light)' }}>
              <Calendar className="w-5 h-5" style={{ color: 'var(--info)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Avg / Trip</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(Math.round(totalEarnings / earningsData.reduce((s, e) => s + e.trips, 0)))}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>All-time average</p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Monthly Breakdown</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {earningsData.map((e, i) => {
              const maxAmount = Math.max(...earningsData.map(d => d.amount));
              const pct = (e.amount / maxAmount) * 100;
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-xs font-medium w-20 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{e.month}</span>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'var(--slate-100)' }}>
                    <div className="h-full rounded-lg flex items-center px-3 text-xs font-semibold text-white transition-all" style={{ width: `${pct}%`, background: 'var(--orange)' }}>
                      {formatCurrency(e.amount)}
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{e.trips} trips</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Payout History</h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {recentPayouts.map((p, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(p.amount)}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.ref} · {p.date}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Completed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
