'use client';

import { mockInvoices } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Receipt, Download, CreditCard } from 'lucide-react';

export default function InvoicesPage() {
  const totalPaid = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalUnpaid = mockInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Invoices & Payments</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>View and manage your invoices.</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Paid</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Outstanding</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>{formatCurrency(totalUnpaid)}</p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Invoices</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{mockInvoices.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Waybill</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Issued</th>
              <th className="px-6 py-4">Due</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {mockInvoices.map(inv => (
              <tr key={inv.id} className="border-t hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                <td className="px-6 py-4 font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{inv.id}</td>
                <td className="px-6 py-4 font-mono text-xs">{inv.waybillNumber}</td>
                <td className="px-6 py-4">{inv.clientName}</td>
                <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(inv.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                    inv.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">{formatDate(inv.issuedAt)}</td>
                <td className="px-6 py-4 text-xs">{formatDate(inv.dueAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100" title="Download"><Download className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /></button>
                    {inv.status !== 'paid' && (
                      <a href="/dashboard/client/payment" className="p-1.5 rounded-lg hover:bg-gray-100" title="Pay Now"><CreditCard className="w-4 h-4" style={{ color: 'var(--orange)' }} /></a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
