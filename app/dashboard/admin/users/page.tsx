'use client';

import { mockDrivers } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Star, Users, Truck } from 'lucide-react';

const mockClients = [
  { id: 'CLI-001', name: 'Dangote Industries', email: 'logistics@dangote.com', shipments: 24, spend: 12500000, joined: 'Jan 2024' },
  { id: 'CLI-002', name: 'Nigerian Breweries', email: 'supply@nbplc.com', shipments: 18, spend: 8200000, joined: 'Mar 2024' },
  { id: 'CLI-003', name: 'BUA Cement', email: 'ops@buacement.com', shipments: 12, spend: 6800000, joined: 'Jun 2024' },
  { id: 'CLI-004', name: 'Unilever Nigeria', email: 'supply@unilever.ng', shipments: 15, spend: 5400000, joined: 'Feb 2024' },
  { id: 'CLI-005', name: 'Nestle Nigeria', email: 'logistics@nestle.ng', shipments: 20, spend: 9100000, joined: 'Apr 2024' },
  { id: 'CLI-006', name: 'MTN Nigeria', email: 'infra@mtn.ng', shipments: 8, spend: 3200000, joined: 'Aug 2024' },
];

export default function UsersPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Users Management</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage clients and drivers on the platform.</p>
      </div>

      {/* Clients */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5" style={{ color: 'var(--info)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Clients ({mockClients.length})</h3>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Shipments</th>
                <th className="px-6 py-4">Total Spend</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {mockClients.map(c => (
                <tr key={c.id} className="border-t hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</td>
                  <td className="px-6 py-4">{c.email}</td>
                  <td className="px-6 py-4">{c.shipments}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(c.spend)}</td>
                  <td className="px-6 py-4 text-xs">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drivers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5" style={{ color: 'var(--orange)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Drivers ({mockDrivers.length})</h3>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Trips</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Earnings</th>
              </tr>
            </thead>
            <tbody className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {mockDrivers.map(d => (
                <tr key={d.id} className="border-t hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--navy)' }}>{d.avatar}</div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{d.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">{d.phone}</td>
                  <td className="px-6 py-4 text-xs">{d.vehicleType} ({d.vehiclePlate})</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      d.status === 'available' ? 'bg-green-100 text-green-800' :
                      d.status === 'on-trip' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {d.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">{d.totalTrips}</td>
                  <td className="px-6 py-4 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current" style={{ color: 'var(--orange)' }} />{d.rating}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(d.earnings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
