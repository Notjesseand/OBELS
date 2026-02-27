import { CargoType } from './utils';

export interface PriceBreakdown {
  baseCost: number;
  distanceCost: number;
  weightCost: number;
  cargoSurcharge: number;
  subtotal: number;
  vat: number;
  total: number;
  currency: string;
  ratePerKm: number;
  ratePerKg: number;
}

const CARGO_MULTIPLIERS: Record<CargoType, number> = {
  general: 1.0,
  fragile: 1.35,
  perishable: 1.5,
  hazardous: 2.0,
  livestock: 1.6,
  machinery: 1.8,
};

const BASE_COST = 15000; // ₦15,000 minimum
const RATE_PER_KM = 150;  // ₦150/km
const RATE_PER_KG = 50;   // ₦50/kg
const VAT_RATE = 0.075;   // 7.5% VAT

export function calculatePrice(
  distanceKm: number,
  weightKg: number,
  cargoType: CargoType = 'general',
  isLTL: boolean = false,
): PriceBreakdown {
  const multiplier = CARGO_MULTIPLIERS[cargoType] || 1.0;
  const ltlDiscount = isLTL ? 0.7 : 1.0; // LTL is ~30% cheaper

  const distanceCost = distanceKm * RATE_PER_KM;
  const weightCost = weightKg * RATE_PER_KG;
  const cargoSurcharge = (distanceCost + weightCost) * (multiplier - 1);
  const subtotal = Math.round((BASE_COST + distanceCost + weightCost + cargoSurcharge) * ltlDiscount);
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  return {
    baseCost: BASE_COST,
    distanceCost: Math.round(distanceCost * ltlDiscount),
    weightCost: Math.round(weightCost * ltlDiscount),
    cargoSurcharge: Math.round(cargoSurcharge * ltlDiscount),
    subtotal,
    vat,
    total,
    currency: 'NGN',
    ratePerKm: RATE_PER_KM,
    ratePerKg: RATE_PER_KG,
  };
}

// Simulated distance lookup (Nigerian cities)
const CITY_DISTANCES: Record<string, Record<string, number>> = {
  'Lagos': { 'Abuja': 536, 'Port Harcourt': 614, 'Kano': 1000, 'Ibadan': 128, 'Benin City': 312, 'Enugu': 557, 'Kaduna': 870, 'Warri': 364, 'Aba': 590, 'Onitsha': 522 },
  'Abuja': { 'Lagos': 536, 'Port Harcourt': 580, 'Kano': 470, 'Ibadan': 460, 'Benin City': 390, 'Enugu': 295, 'Kaduna': 180, 'Warri': 450, 'Aba': 545, 'Onitsha': 330 },
  'Port Harcourt': { 'Lagos': 614, 'Abuja': 580, 'Kano': 1050, 'Ibadan': 560, 'Benin City': 310, 'Enugu': 235, 'Kaduna': 760, 'Warri': 155, 'Aba': 60, 'Onitsha': 180 },
  'Kano': { 'Lagos': 1000, 'Abuja': 470, 'Port Harcourt': 1050, 'Ibadan': 900, 'Benin City': 780, 'Enugu': 700, 'Kaduna': 190, 'Warri': 820, 'Aba': 980, 'Onitsha': 740 },
  'Ibadan': { 'Lagos': 128, 'Abuja': 460, 'Port Harcourt': 560, 'Kano': 900, 'Benin City': 230, 'Enugu': 480, 'Kaduna': 740, 'Warri': 310, 'Aba': 520, 'Onitsha': 450 },
  'Benin City': { 'Lagos': 312, 'Abuja': 390, 'Port Harcourt': 310, 'Kano': 780, 'Ibadan': 230, 'Enugu': 250, 'Kaduna': 570, 'Warri': 100, 'Aba': 280, 'Onitsha': 210 },
  'Enugu': { 'Lagos': 557, 'Abuja': 295, 'Port Harcourt': 235, 'Kano': 700, 'Ibadan': 480, 'Benin City': 250, 'Kaduna': 475, 'Warri': 300, 'Aba': 180, 'Onitsha': 100 },
  'Kaduna': { 'Lagos': 870, 'Abuja': 180, 'Port Harcourt': 760, 'Kano': 190, 'Ibadan': 740, 'Benin City': 570, 'Enugu': 475, 'Warri': 620, 'Aba': 700, 'Onitsha': 500 },
  'Warri': { 'Lagos': 364, 'Abuja': 450, 'Port Harcourt': 155, 'Kano': 820, 'Ibadan': 310, 'Benin City': 100, 'Enugu': 300, 'Kaduna': 620, 'Aba': 200, 'Onitsha': 260 },
  'Aba': { 'Lagos': 590, 'Abuja': 545, 'Port Harcourt': 60, 'Kano': 980, 'Ibadan': 520, 'Benin City': 280, 'Enugu': 180, 'Kaduna': 700, 'Warri': 200, 'Onitsha': 130 },
  'Onitsha': { 'Lagos': 522, 'Abuja': 330, 'Port Harcourt': 180, 'Kano': 740, 'Ibadan': 450, 'Benin City': 210, 'Enugu': 100, 'Kaduna': 500, 'Warri': 260, 'Aba': 130 },
};

export function getDistance(origin: string, destination: string): number | null {
  const from = CITY_DISTANCES[origin];
  if (!from) return null;
  return from[destination] ?? null;
}

export function getAvailableCities(): string[] {
  return Object.keys(CITY_DISTANCES).sort();
}
