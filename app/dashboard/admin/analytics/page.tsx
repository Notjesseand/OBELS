'use client';

import { monthlyRevenue, deliveryPerformance, topRoutes } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Clock, Route } from 'lucide-react';
import dynamic from 'next/dynamic';

const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const RechartsBarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const Legend = dynamic(() => import('recharts').then(m => m.Legend), { ssr: false });

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Deep insights into your logistics operations.</p>
      </div>

      {/* Revenue Trend */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--orange)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Revenue Trend</h3>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--orange)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₦${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area type="monotone" dataKey="revenue" stroke="var(--orange)" fill="url(#revGradient)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Delivery Performance */}
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5" style={{ color: 'var(--info)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Delivery Performance</h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <RechartsBarChart data={deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="onTime" name="On Time" fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" name="Late" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Route className="w-5 h-5" style={{ color: 'var(--orange)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Top Routes</h3>
          </div>
          <div className="space-y-4">
            {topRoutes.map((r, i) => {
              const maxTrips = Math.max(...topRoutes.map(x => x.trips));
              return (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.route}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.trips} trips · {formatCurrency(r.revenue)}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--slate-100)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(r.trips / maxTrips) * 100}%`, background: 'var(--orange)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
