'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { onDriverShipmentsSnapshot, ShipmentRecord } from '@/lib/tracking';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function EarningsPage() {
  const { userProfile } = useAuth();
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.role === 'driver' && userProfile.uid) {
      const unsub = onDriverShipmentsSnapshot(userProfile.uid, (data) => {
        setShipments(data);
        setLoading(false);
      });
      return () => unsub();
    } else if (userProfile) {
      setLoading(false);
    }
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--orange)' }} />
      </div>
    );
  }

  // Only count delivered shipments for actual earnings
  const deliveredShipments = shipments.filter(s => s.currentStatus === 'delivered');
  
  const totalEarnings = deliveredShipments.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalTrips = deliveredShipments.length;
  const avgPerTrip = totalTrips > 0 ? Math.round(totalEarnings / totalTrips) : 0;
  
  const currentMonthPrefix = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
  const thisMonthShipments = deliveredShipments.filter(s => {
    const d = s.createdAt instanceof Timestamp ? s.createdAt.toDate() : new Date(s.createdAt);
    return d.toLocaleString('default', { month: 'short', year: 'numeric' }) === currentMonthPrefix;
  });
  
  const thisMonthEarnings = thisMonthShipments.reduce((sum, s) => sum + (s.price || 0), 0);
  const thisMonthTrips = thisMonthShipments.length;

  // Monthly breakdown
  const monthlyDataMap = new Map<string, { month: string, trips: number, amount: number, sortKey: number }>();
  
  deliveredShipments.forEach(s => {
    const d = s.createdAt instanceof Timestamp ? s.createdAt.toDate() : new Date(s.createdAt);
    const monthStr = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    const sortKey = d.getFullYear() * 100 + d.getMonth();
    
    if (!monthlyDataMap.has(monthStr)) {
      monthlyDataMap.set(monthStr, { month: monthStr, trips: 0, amount: 0, sortKey });
    }
    const data = monthlyDataMap.get(monthStr)!;
    data.trips += 1;
    data.amount += (s.price || 0);
  });
  
  const earningsData = Array.from(monthlyDataMap.values()).sort((a, b) => a.sortKey - b.sortKey);
  
  // Generate mock payout history based on past months' earnings (for months with > 0 earnings)
  const recentPayouts = earningsData
    .filter(e => e.month !== currentMonthPrefix && e.amount > 0)
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 5)
    .map((e, i) => ({
      amount: e.amount,
      date: `End of ${e.month}`,
      ref: `PAY-${e.sortKey}-${1000 + i}`,
      status: 'completed'
    }));

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
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>All-time total</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--success-light)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--success)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>This Month</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(thisMonthEarnings)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{thisMonthTrips} trips completed</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--info-light)' }}>
              <Calendar className="w-5 h-5" style={{ color: 'var(--info)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Avg / Trip</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(avgPerTrip)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>All-time average</p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Monthly Breakdown</h3>
        </div>
        <div className="p-6">
          {earningsData.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No earnings data yet.</p>
          ) : (
            <div className="space-y-4">
              {earningsData.map((e, i) => {
                const maxAmount = Math.max(...earningsData.map(d => d.amount));
                const pct = maxAmount > 0 ? (e.amount / maxAmount) * 100 : 0;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs font-medium w-20 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{e.month}</span>
                    <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'var(--slate-100)' }}>
                      <div className="h-full rounded-lg flex items-center px-3 text-xs font-semibold text-white transition-all" style={{ width: `${Math.max(pct, 5)}%`, background: 'var(--orange)' }}>
                        {formatCurrency(e.amount)}
                      </div>
                    </div>
                    <span className="text-xs w-16 text-right" style={{ color: 'var(--text-muted)' }}>{e.trips} {e.trips === 1 ? 'trip' : 'trips'}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Payout History (Past Months)</h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {recentPayouts.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>No completed payouts found.</p>
          ) : (
            recentPayouts.map((p, i) => (
              <div key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(p.amount)}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.ref} · {p.date}</p>
                </div>
                <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> Completed
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
