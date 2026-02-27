import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// Collections
export const USERS_COLLECTION = 'users';
export const SHIPMENTS_COLLECTION = 'shipments';

export interface Shipment {
  id?: string;
  trackingId: string;
  clientId: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  weight: number;
  cargoType: string;
  price: number;
  driverId?: string;
  createdAt: string;
}

// ------ Users ------
export async function getUserProfile(uid: string) {
  const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}

// ------ Shipments ------
export async function createShipment(shipmentData: Omit<Shipment, 'id'>) {
  const newRef = doc(collection(db, SHIPMENTS_COLLECTION));
  const newShipment = { ...shipmentData, id: newRef.id };
  await setDoc(newRef, newShipment);
  return newShipment;
}

export async function getShipmentByTrackingId(trackingId: string) {
  const q = query(collection(db, SHIPMENTS_COLLECTION), where('trackingId', '==', trackingId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as Shipment;
}

export async function getClientShipments(clientId: string) {
  const q = query(collection(db, SHIPMENTS_COLLECTION), where('clientId', '==', clientId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Shipment);
}

export async function updateShipmentStatus(shipmentId: string, status: Shipment['status']) {
  const ref = doc(db, SHIPMENTS_COLLECTION, shipmentId);
  await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
}

export async function getAllShipments() {
  const snapshot = await getDocs(collection(db, SHIPMENTS_COLLECTION));
  return snapshot.docs.map(doc => doc.data() as Shipment);
}
