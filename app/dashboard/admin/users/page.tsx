'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Star, Users, Truck, Loader2 } from 'lucide-react';
import { getAllUsers } from '@/lib/db';
import { getAllShipments, ShipmentRecord } from '@/lib/tracking';
import { UserProfile } from '@/lib/auth-context';

export default function UsersPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await getAllUsers() as UserProfile[];
        const shipments = await getAllShipments();

        const allClients = users.filter(u => u.role === 'client');
        const allDrivers = users.filter(u => u.role === 'driver');

        // Aggregate client data
        const clientData = allClients.map(c => {
          const clientShipments = shipments.filter(s => s.clientEmail === c.email || s.clientUid === c.uid);
          const totalSpend = clientShipments.reduce((sum, s) => sum + (s.price || 0), 0);
          return {
            id: c.uid,
            name: c.companyName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unnamed Client',
            email: c.email,
            shipments: clientShipments.length,
            spend: totalSpend,
            joined: c.createdAt ? formatDate(c.createdAt) : 'Unknown'
          };
        });

        // Aggregate driver data
        const driverData = allDrivers.map(d => {
          // driverUid is stored during assignment. driverName/driverPhone is also stored
          const driverShipments = shipments.filter(s => s.driverUid === d.uid || s.driverName === `${d.firstName} ${d.lastName}`);
          const deliveredShipments = driverShipments.filter(s => s.currentStatus === 'delivered');
          
          // Earnings = 70% of price for delivered shipments (as per earlier earnings logic)
          const earnings = deliveredShipments.reduce((sum, s) => sum + (s.price ? s.price * 0.7 : 0), 0);
          
          return {
            id: d.uid,
            avatar: (d.firstName?.[0] || 'D').toUpperCase(),
            name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Unknown Driver',
            phone: 'N/A', // Or fetch from d if phone was saved. Let's look for d.phone if it exists, otherwise N/A
            vehiclePlate: d.driverLicense || 'Unknown',
            vehicleType: 'Truck', // Add this to UserProfile if needed, currently not stored in signup
            status: driverShipments.some(s => s.currentStatus === 'in-transit') ? 'on-trip' : 'available',
            totalTrips: deliveredShipments.length,
            rating: '4.8', // Mock rating as actual rating system isn't implemented
            earnings,
            rawPhone: (d as any).phone || 'N/A'
          };
        });

        setClients(clientData);
        setDrivers(driverData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Users Management</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage clients and drivers on the platform.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2" style={{ color: 'var(--text-muted)' }}>
          <Loader2 className="w-5 h-5 animate-spin" /> Loading users...
        </div>
      ) : (
        <>
          {/* Clients */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: 'var(--info)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Clients ({clients.length})</h3>
            </div>
            <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
              {clients.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No clients found.</div>
              ) : (
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
                    {clients.map(c => (
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
              )}
            </div>
          </div>

          {/* Drivers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5" style={{ color: 'var(--orange)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Drivers ({drivers.length})</h3>
            </div>
            <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
              {drivers.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No drivers found.</div>
              ) : (
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
                    {drivers.map(d => (
                      <tr key={d.id} className="border-t hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase" style={{ background: 'var(--navy)' }}>{d.avatar}</div>
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{d.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">{d.rawPhone}</td>
                        <td className="px-6 py-4 text-xs">{d.vehicleType} <br/> <span className="text-gray-400">({d.vehiclePlate})</span></td>
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
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
