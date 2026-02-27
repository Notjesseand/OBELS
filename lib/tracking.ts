import { db } from './firebase';
import {
  collection, doc, setDoc, addDoc, getDocs, getDoc,
  query, orderBy, serverTimestamp, Timestamp, where, onSnapshot
} from 'firebase/firestore';
import { ShipmentStatus } from './utils';

// ── Types ──

export interface TrackingEvent {
  id?: string;
  status: ShipmentStatus;
  timestamp: Timestamp | Date;
  updatedBy: string;
  driverName: string;
  note: string;
}

export interface ShipmentRecord {
  waybillNumber: string;
  clientName: string;
  clientEmail: string;
  clientUid?: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight: number;
  type: 'FTL' | 'LTL';
  price: number;
  currentStatus: ShipmentStatus;
  driverName: string | null;
  driverPhone: string | null;
  driverUid?: string | null;
  vehiclePlate: string | null;
  createdAt: Timestamp | Date;
  estimatedDelivery: string;
}

const STATUS_NOTES: Record<ShipmentStatus, string> = {
  'pending': 'Shipment has been booked and is awaiting confirmation.',
  'confirmed': 'Shipment confirmed and driver has been assigned.',
  'picked-up': 'Cargo has been collected from the pickup location.',
  'in-transit': 'Cargo is on the road and heading to the destination.',
  'delivered': 'Cargo has been delivered to the destination.',
  'cancelled': 'Shipment has been cancelled.',
};

// ── Core Operations ──

export async function createShipmentRecord(
  waybillNumber: string,
  data: Omit<ShipmentRecord, 'waybillNumber' | 'createdAt' | 'currentStatus'>
): Promise<void> {
  const shipmentRef = doc(db, 'shipments', waybillNumber);
  await setDoc(shipmentRef, {
    ...data,
    waybillNumber,
    currentStatus: 'pending' as ShipmentStatus,
    createdAt: serverTimestamp(),
  });
  await addTrackingEvent(waybillNumber, {
    status: 'pending',
    updatedBy: 'system',
    driverName: 'System',
    note: STATUS_NOTES['pending'],
  });
}

export async function recordStatusUpdate(
  waybillNumber: string,
  status: ShipmentStatus,
  driverUid: string,
  driverName: string,
  customNote?: string
): Promise<void> {
  const shipmentRef = doc(db, 'shipments', waybillNumber);
  await setDoc(shipmentRef, { currentStatus: status }, { merge: true });
  await addTrackingEvent(waybillNumber, {
    status,
    updatedBy: driverUid,
    driverName,
    note: customNote || STATUS_NOTES[status] || `Status changed to ${status}.`,
  });
}

async function addTrackingEvent(
  waybillNumber: string,
  event: Omit<TrackingEvent, 'timestamp' | 'id'>
): Promise<void> {
  const trackingRef = collection(db, 'shipments', waybillNumber, 'tracking');
  await addDoc(trackingRef, { ...event, timestamp: serverTimestamp() });
}

export async function getTrackingHistory(waybillNumber: string): Promise<TrackingEvent[]> {
  const trackingRef = collection(db, 'shipments', waybillNumber, 'tracking');
  const q = query(trackingRef, orderBy('timestamp', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TrackingEvent));
}

export async function lookupShipment(waybillNumber: string): Promise<ShipmentRecord | null> {
  const shipmentRef = doc(db, 'shipments', waybillNumber);
  const snapshot = await getDoc(shipmentRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as ShipmentRecord;
}

// ── Query Functions ──

/** Get all shipments (admin). */
export async function getAllShipments(): Promise<ShipmentRecord[]> {
  const q = query(collection(db, 'shipments'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as ShipmentRecord);
}

/** Real-time listener for all shipments (admin). Returns unsubscribe fn. */
export function onShipmentsSnapshot(callback: (shipments: ShipmentRecord[]) => void): () => void {
  const q = query(collection(db, 'shipments'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as ShipmentRecord)));
}

/** Real-time listener for a client's shipments. */
export function onClientShipmentsSnapshot(clientEmail: string, callback: (shipments: ShipmentRecord[]) => void): () => void {
  const q = query(collection(db, 'shipments'), where('clientEmail', '==', clientEmail), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as ShipmentRecord)));
}

/** Real-time listener for a driver's assigned shipments. */
export function onDriverShipmentsSnapshot(driverUid: string, callback: (shipments: ShipmentRecord[]) => void): () => void {
  const q = query(collection(db, 'shipments'), where('driverUid', '==', driverUid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => d.data() as ShipmentRecord)));
}

/** Assign a driver to a shipment (admin action). */
export async function assignDriverToShipment(
  waybillNumber: string,
  driverUid: string,
  driverName: string,
  driverPhone: string,
  vehiclePlate: string
): Promise<void> {
  const shipmentRef = doc(db, 'shipments', waybillNumber);
  await setDoc(shipmentRef, {
    driverName, driverPhone, driverUid, vehiclePlate,
    currentStatus: 'confirmed' as ShipmentStatus,
  }, { merge: true });

  await addTrackingEvent(waybillNumber, {
    status: 'confirmed',
    updatedBy: 'admin',
    driverName: 'Admin',
    note: `Driver ${driverName} (${vehiclePlate}) has been assigned to this shipment.`,
  });
}

/** Activity item for dashboard feeds */
export interface ActivityItem {
  waybillNumber: string;
  status: ShipmentStatus;
  note: string;
  driverName: string;
  timestamp: Timestamp | Date;
  origin?: string;
  destination?: string;
}

/** Get recent activity across all shipments (for dashboards). */
export async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
  const shipmentsSnap = await getDocs(query(collection(db, 'shipments'), orderBy('createdAt', 'desc')));
  const allEvents: ActivityItem[] = [];

  for (const shipDoc of shipmentsSnap.docs) {
    const shipData = shipDoc.data() as ShipmentRecord;
    const trackingSnap = await getDocs(
      query(collection(db, 'shipments', shipDoc.id, 'tracking'), orderBy('timestamp', 'desc'))
    );
    for (const evDoc of trackingSnap.docs) {
      const ev = evDoc.data() as TrackingEvent;
      allEvents.push({
        waybillNumber: shipData.waybillNumber,
        status: ev.status,
        note: ev.note,
        driverName: ev.driverName,
        timestamp: ev.timestamp,
        origin: shipData.origin,
        destination: shipData.destination,
      });
    }
  }

  // Sort by timestamp descending and take the top N
  allEvents.sort((a, b) => {
    const tA = a.timestamp instanceof Timestamp ? a.timestamp.toMillis() : new Date(a.timestamp).getTime();
    const tB = b.timestamp instanceof Timestamp ? b.timestamp.toMillis() : new Date(b.timestamp).getTime();
    return tB - tA;
  });

  return allEvents.slice(0, limit);
}

