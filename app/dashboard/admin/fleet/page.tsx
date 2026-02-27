'use client';

import { mockVehicles } from '@/lib/mock-data';
import { Truck, Wrench, XCircle, CheckCircle } from 'lucide-react';

export default function FleetPage() {
  const active = mockVehicles.filter(v => v.status === 'active').length;
  const maintenance = mockVehicles.filter(v => v.status === 'maintenance').length;
  const inactive = mockVehicles.filter(v => v.status === 'inactive').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Fleet Management</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your vehicle fleet and assignments.</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] rounded-xl border p-5 flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--success-light)' }}><CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} /></div>
          <div><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Active</p><p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{active}</p></div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-5 flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--warning-light)' }}><Wrench className="w-5 h-5" style={{ color: 'var(--warning)' }} /></div>
          <div><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Maintenance</p><p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{maintenance}</p></div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-5 flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--danger-light)' }}><XCircle className="w-5 h-5" style={{ color: 'var(--danger)' }} /></div>
          <div><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Inactive</p><p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{inactive}</p></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              <th className="px-6 py-4">Plate</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Make / Model</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Mileage</th>
              <th className="px-6 py-4">Last Service</th>
            </tr>
          </thead>
          <tbody className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {mockVehicles.map(v => (
              <tr key={v.id} className="border-t hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                <td className="px-6 py-4 font-mono text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{v.plate}</td>
                <td className="px-6 py-4">{v.type}</td>
                <td className="px-6 py-4">{v.make} {v.model}</td>
                <td className="px-6 py-4">{v.year}</td>
                <td className="px-6 py-4">{v.capacity}</td>
                <td className="px-6 py-4">{v.driverName || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    v.status === 'active' ? 'bg-green-100 text-green-800' :
                    v.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">{v.mileage.toLocaleString()} km</td>
                <td className="px-6 py-4 text-xs">{v.lastService}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
