import { ShipmentStatus, CargoType } from './utils';

export interface Shipment {
  id: string;
  waybillNumber: string;
  clientName: string;
  clientEmail: string;
  origin: string;
  destination: string;
  cargoType: CargoType;
  weight: number;
  status: ShipmentStatus;
  type: 'FTL' | 'LTL';
  driverName: string | null;
  driverPhone: string | null;
  vehiclePlate: string | null;
  price: number;
  createdAt: string;
  estimatedDelivery: string;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  lat: number;
  lng: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  vehiclePlate: string;
  vehicleType: string;
  status: 'available' | 'on-trip' | 'offline';
  rating: number;
  totalTrips: number;
  earnings: number;
  avatar: string;
  joinedAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: string;
  make: string;
  model: string;
  year: number;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
  driverName: string | null;
  lastService: string;
  mileage: number;
}

export interface Quote {
  id: string;
  clientName: string;
  origin: string;
  destination: string;
  cargoType: CargoType;
  weight: number;
  type: 'FTL' | 'LTL';
  price: number;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface Invoice {
  id: string;
  shipmentId: string;
  waybillNumber: string;
  clientName: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
}

export const mockShipments: Shipment[] = [
  {
    id: 'SHP-001', waybillNumber: 'WB260201A1B2', clientName: 'Dangote Industries', clientEmail: 'logistics@dangote.com',
    origin: 'Lagos', destination: 'Abuja', cargoType: 'general', weight: 12000, status: 'in-transit', type: 'FTL',
    driverName: 'Emeka Okafor', driverPhone: '+234 801 234 5678', vehiclePlate: 'LG-234-KJA',
    price: 485000, createdAt: '2026-02-20T09:00:00Z', estimatedDelivery: '2026-02-27T18:00:00Z',
    pickedUpAt: '2026-02-21T06:00:00Z', deliveredAt: null, lat: 7.4905, lng: 4.5418,
  },
  {
    id: 'SHP-002', waybillNumber: 'WB260203C3D4', clientName: 'Nigerian Breweries', clientEmail: 'supply@nbplc.com',
    origin: 'Ibadan', destination: 'Benin City', cargoType: 'perishable', weight: 8000, status: 'picked-up', type: 'FTL',
    driverName: 'Adamu Bello', driverPhone: '+234 802 345 6789', vehiclePlate: 'KN-567-ABC',
    price: 320000, createdAt: '2026-02-22T10:00:00Z', estimatedDelivery: '2026-02-28T12:00:00Z',
    pickedUpAt: '2026-02-23T07:00:00Z', deliveredAt: null, lat: 7.3776, lng: 3.9470,
  },
  {
    id: 'SHP-003', waybillNumber: 'WB260205E5F6', clientName: 'BUA Cement', clientEmail: 'ops@buacement.com',
    origin: 'Port Harcourt', destination: 'Kano', cargoType: 'machinery', weight: 25000, status: 'confirmed', type: 'FTL',
    driverName: 'Yakubu Musa', driverPhone: '+234 803 456 7890', vehiclePlate: 'AB-789-DEF',
    price: 1250000, createdAt: '2026-02-24T14:00:00Z', estimatedDelivery: '2026-03-02T10:00:00Z',
    pickedUpAt: null, deliveredAt: null, lat: 4.8156, lng: 7.0498,
  },
  {
    id: 'SHP-004', waybillNumber: 'WB260207G7H8', clientName: 'Unilever Nigeria', clientEmail: 'supply@unilever.ng',
    origin: 'Lagos', destination: 'Enugu', cargoType: 'fragile', weight: 3500, status: 'delivered', type: 'LTL',
    driverName: 'Chidi Nwosu', driverPhone: '+234 804 567 8901', vehiclePlate: 'EN-012-GHI',
    price: 195000, createdAt: '2026-02-15T08:00:00Z', estimatedDelivery: '2026-02-20T16:00:00Z',
    pickedUpAt: '2026-02-16T06:30:00Z', deliveredAt: '2026-02-19T14:00:00Z', lat: 6.4541, lng: 7.5103,
  },
  {
    id: 'SHP-005', waybillNumber: 'WB260209I9J0', clientName: 'Nestle Nigeria', clientEmail: 'logistics@nestle.ng',
    origin: 'Abuja', destination: 'Warri', cargoType: 'perishable', weight: 6000, status: 'in-transit', type: 'FTL',
    driverName: 'Ibrahim Lawal', driverPhone: '+234 805 678 9012', vehiclePlate: 'KD-345-JKL',
    price: 380000, createdAt: '2026-02-23T11:00:00Z', estimatedDelivery: '2026-02-28T08:00:00Z',
    pickedUpAt: '2026-02-24T05:00:00Z', deliveredAt: null, lat: 7.7335, lng: 6.0012,
  },
  {
    id: 'SHP-006', waybillNumber: 'WB260211K1L2', clientName: 'MTN Nigeria', clientEmail: 'infra@mtn.ng',
    origin: 'Kaduna', destination: 'Lagos', cargoType: 'general', weight: 4500, status: 'pending', type: 'LTL',
    driverName: null, driverPhone: null, vehiclePlate: null,
    price: 410000, createdAt: '2026-02-25T09:00:00Z', estimatedDelivery: '2026-03-01T18:00:00Z',
    pickedUpAt: null, deliveredAt: null, lat: 10.5105, lng: 7.4165,
  },
  {
    id: 'SHP-007', waybillNumber: 'WB260213M3N4', clientName: 'Flour Mills Nigeria', clientEmail: 'ops@fmn.com',
    origin: 'Lagos', destination: 'Onitsha', cargoType: 'general', weight: 18000, status: 'delivered', type: 'FTL',
    driverName: 'Sunday Adeleke', driverPhone: '+234 806 789 0123', vehiclePlate: 'OG-678-MNO',
    price: 550000, createdAt: '2026-02-10T07:00:00Z', estimatedDelivery: '2026-02-15T16:00:00Z',
    pickedUpAt: '2026-02-11T05:00:00Z', deliveredAt: '2026-02-14T12:00:00Z', lat: 6.1459, lng: 6.7924,
  },
  {
    id: 'SHP-008', waybillNumber: 'WB260215O5P6', clientName: 'Lafarge Africa', clientEmail: 'logistics@lafarge.ng',
    origin: 'Enugu', destination: 'Aba', cargoType: 'machinery', weight: 30000, status: 'in-transit', type: 'FTL',
    driverName: 'Peter Obi', driverPhone: '+234 807 890 1234', vehiclePlate: 'AN-901-PQR',
    price: 680000, createdAt: '2026-02-24T06:00:00Z', estimatedDelivery: '2026-02-26T18:00:00Z',
    pickedUpAt: '2026-02-24T12:00:00Z', deliveredAt: null, lat: 5.7168, lng: 7.3048,
  },
];

export const mockDrivers: Driver[] = [
  { id: 'DRV-001', name: 'Emeka Okafor', phone: '+234 801 234 5678', email: 'emeka@obels.ng', licenseNumber: 'LIC-2020-001', vehiclePlate: 'LG-234-KJA', vehicleType: 'Flatbed Truck', status: 'on-trip', rating: 4.8, totalTrips: 234, earnings: 4500000, avatar: 'EO', joinedAt: '2023-06-15' },
  { id: 'DRV-002', name: 'Adamu Bello', phone: '+234 802 345 6789', email: 'adamu@obels.ng', licenseNumber: 'LIC-2019-042', vehiclePlate: 'KN-567-ABC', vehicleType: 'Refrigerated Truck', status: 'on-trip', rating: 4.6, totalTrips: 189, earnings: 3800000, avatar: 'AB', joinedAt: '2023-01-10' },
  { id: 'DRV-003', name: 'Yakubu Musa', phone: '+234 803 456 7890', email: 'yakubu@obels.ng', licenseNumber: 'LIC-2021-015', vehiclePlate: 'AB-789-DEF', vehicleType: 'Low-bed Trailer', status: 'available', rating: 4.9, totalTrips: 312, earnings: 6200000, avatar: 'YM', joinedAt: '2022-09-20' },
  { id: 'DRV-004', name: 'Chidi Nwosu', phone: '+234 804 567 8901', email: 'chidi@obels.ng', licenseNumber: 'LIC-2022-008', vehiclePlate: 'EN-012-GHI', vehicleType: 'Box Truck', status: 'available', rating: 4.7, totalTrips: 156, earnings: 2900000, avatar: 'CN', joinedAt: '2023-11-05' },
  { id: 'DRV-005', name: 'Ibrahim Lawal', phone: '+234 805 678 9012', email: 'ibrahim@obels.ng', licenseNumber: 'LIC-2020-023', vehiclePlate: 'KD-345-JKL', vehicleType: 'Tanker', status: 'on-trip', rating: 4.5, totalTrips: 278, earnings: 5100000, avatar: 'IL', joinedAt: '2022-04-12' },
  { id: 'DRV-006', name: 'Sunday Adeleke', phone: '+234 806 789 0123', email: 'sunday@obels.ng', licenseNumber: 'LIC-2021-031', vehiclePlate: 'OG-678-MNO', vehicleType: 'Flatbed Truck', status: 'available', rating: 4.8, totalTrips: 201, earnings: 3700000, avatar: 'SA', joinedAt: '2023-03-08' },
  { id: 'DRV-007', name: 'Peter Obi', phone: '+234 807 890 1234', email: 'peter@obels.ng', licenseNumber: 'LIC-2019-055', vehiclePlate: 'AN-901-PQR', vehicleType: 'Low-bed Trailer', status: 'on-trip', rating: 4.9, totalTrips: 345, earnings: 7200000, avatar: 'PO', joinedAt: '2021-12-01' },
  { id: 'DRV-008', name: 'Tunde Bakare', phone: '+234 808 901 2345', email: 'tunde@obels.ng', licenseNumber: 'LIC-2023-003', vehiclePlate: 'OY-234-STU', vehicleType: 'Box Truck', status: 'offline', rating: 4.3, totalTrips: 87, earnings: 1500000, avatar: 'TB', joinedAt: '2024-02-20' },
];

export const mockVehicles: Vehicle[] = [
  { id: 'VEH-001', plate: 'LG-234-KJA', type: 'Flatbed Truck', make: 'MAN', model: 'TGS 33.360', year: 2022, capacity: '20 tonnes', status: 'active', driverName: 'Emeka Okafor', lastService: '2026-01-15', mileage: 125000 },
  { id: 'VEH-002', plate: 'KN-567-ABC', type: 'Refrigerated Truck', make: 'Volvo', model: 'FH 460', year: 2023, capacity: '15 tonnes', status: 'active', driverName: 'Adamu Bello', lastService: '2026-02-01', mileage: 89000 },
  { id: 'VEH-003', plate: 'AB-789-DEF', type: 'Low-bed Trailer', make: 'Scania', model: 'R500', year: 2021, capacity: '40 tonnes', status: 'active', driverName: 'Yakubu Musa', lastService: '2026-01-20', mileage: 210000 },
  { id: 'VEH-004', plate: 'EN-012-GHI', type: 'Box Truck', make: 'Mercedes', model: 'Actros 2643', year: 2023, capacity: '10 tonnes', status: 'active', driverName: 'Chidi Nwosu', lastService: '2026-02-10', mileage: 56000 },
  { id: 'VEH-005', plate: 'KD-345-JKL', type: 'Tanker', make: 'DAF', model: 'CF 85.410', year: 2020, capacity: '33,000 litres', status: 'active', driverName: 'Ibrahim Lawal', lastService: '2025-12-15', mileage: 180000 },
  { id: 'VEH-006', plate: 'OG-678-MNO', type: 'Flatbed Truck', make: 'IVECO', model: 'Trakker 440', year: 2022, capacity: '25 tonnes', status: 'active', driverName: 'Sunday Adeleke', lastService: '2026-01-28', mileage: 145000 },
  { id: 'VEH-007', plate: 'AN-901-PQR', type: 'Low-bed Trailer', make: 'MAN', model: 'TGX 41.540', year: 2021, capacity: '45 tonnes', status: 'active', driverName: 'Peter Obi', lastService: '2026-02-05', mileage: 195000 },
  { id: 'VEH-008', plate: 'OY-234-STU', type: 'Box Truck', make: 'Hino', model: '500 Series', year: 2024, capacity: '8 tonnes', status: 'maintenance', driverName: null, lastService: '2026-02-20', mileage: 32000 },
  { id: 'VEH-009', plate: 'RV-567-VWX', type: 'Container Truck', make: 'Scania', model: 'G410', year: 2023, capacity: '30 tonnes', status: 'inactive', driverName: null, lastService: '2025-11-10', mileage: 98000 },
];

export const mockQuotes: Quote[] = [
  { id: 'QT-001', clientName: 'Dangote Industries', origin: 'Lagos', destination: 'Kano', cargoType: 'general', weight: 15000, type: 'FTL', price: 820000, status: 'pending', createdAt: '2026-02-25T10:00:00Z', expiresAt: '2026-03-04T10:00:00Z' },
  { id: 'QT-002', clientName: 'Nigerian Breweries', origin: 'Ibadan', destination: 'Abuja', cargoType: 'perishable', weight: 5000, type: 'LTL', price: 285000, status: 'accepted', createdAt: '2026-02-20T14:00:00Z', expiresAt: '2026-02-27T14:00:00Z' },
  { id: 'QT-003', clientName: 'MTN Nigeria', origin: 'Lagos', destination: 'Port Harcourt', cargoType: 'fragile', weight: 2000, type: 'LTL', price: 210000, status: 'expired', createdAt: '2026-02-10T08:00:00Z', expiresAt: '2026-02-17T08:00:00Z' },
];

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', shipmentId: 'SHP-004', waybillNumber: 'WB260207G7H8', clientName: 'Unilever Nigeria', amount: 195000, status: 'paid', issuedAt: '2026-02-19T14:00:00Z', dueAt: '2026-03-05T14:00:00Z', paidAt: '2026-02-22T11:00:00Z' },
  { id: 'INV-002', shipmentId: 'SHP-007', waybillNumber: 'WB260213M3N4', clientName: 'Flour Mills Nigeria', amount: 550000, status: 'paid', issuedAt: '2026-02-14T12:00:00Z', dueAt: '2026-02-28T12:00:00Z', paidAt: '2026-02-25T09:00:00Z' },
  { id: 'INV-003', shipmentId: 'SHP-001', waybillNumber: 'WB260201A1B2', clientName: 'Dangote Industries', amount: 485000, status: 'unpaid', issuedAt: '2026-02-21T06:00:00Z', dueAt: '2026-03-07T06:00:00Z', paidAt: null },
  { id: 'INV-004', shipmentId: 'SHP-005', waybillNumber: 'WB260209I9J0', clientName: 'Nestle Nigeria', amount: 380000, status: 'unpaid', issuedAt: '2026-02-24T05:00:00Z', dueAt: '2026-03-10T05:00:00Z', paidAt: null },
  { id: 'INV-005', shipmentId: 'SHP-002', waybillNumber: 'WB260203C3D4', clientName: 'Nigerian Breweries', amount: 320000, status: 'overdue', issuedAt: '2026-02-12T07:00:00Z', dueAt: '2026-02-26T07:00:00Z', paidAt: null },
];

// Revenue data for charts
export const monthlyRevenue = [
  { month: 'Sep', revenue: 8200000, shipments: 34 },
  { month: 'Oct', revenue: 9500000, shipments: 41 },
  { month: 'Nov', revenue: 11200000, shipments: 48 },
  { month: 'Dec', revenue: 13800000, shipments: 55 },
  { month: 'Jan', revenue: 12100000, shipments: 50 },
  { month: 'Feb', revenue: 10800000, shipments: 45 },
];

export const deliveryPerformance = [
  { day: 'Mon', onTime: 12, late: 2 },
  { day: 'Tue', onTime: 15, late: 1 },
  { day: 'Wed', onTime: 10, late: 3 },
  { day: 'Thu', onTime: 14, late: 2 },
  { day: 'Fri', onTime: 18, late: 1 },
  { day: 'Sat', onTime: 8, late: 0 },
  { day: 'Sun', onTime: 3, late: 0 },
];

export const topRoutes = [
  { route: 'Lagos → Abuja', trips: 85, revenue: 12500000 },
  { route: 'Lagos → Port Harcourt', trips: 62, revenue: 9800000 },
  { route: 'Abuja → Kano', trips: 45, revenue: 6200000 },
  { route: 'Lagos → Ibadan', trips: 78, revenue: 4800000 },
  { route: 'Enugu → Onitsha', trips: 34, revenue: 3200000 },
];
