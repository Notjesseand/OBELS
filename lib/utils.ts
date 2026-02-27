export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${amount.toLocaleString()}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export type ShipmentStatus = 'pending' | 'confirmed' | 'picked-up' | 'in-transit' | 'delivered' | 'cancelled';

export function getStatusColor(status: ShipmentStatus): { bg: string; text: string; dot: string } {
  const colors: Record<ShipmentStatus, { bg: string; text: string; dot: string }> = {
    'pending': { bg: 'bg-warning-light', text: 'text-amber-800', dot: 'bg-warning' },
    'confirmed': { bg: 'bg-info-light', text: 'text-blue-800', dot: 'bg-info' },
    'picked-up': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
    'in-transit': { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange' },
    'delivered': { bg: 'bg-success-light', text: 'text-green-800', dot: 'bg-success' },
    'cancelled': { bg: 'bg-danger-light', text: 'text-red-800', dot: 'bg-danger' },
  };
  return colors[status] || colors['pending'];
}

export type CargoType = 'general' | 'fragile' | 'perishable' | 'hazardous' | 'livestock' | 'machinery';

export function getCargoLabel(type: CargoType): string {
  const labels: Record<CargoType, string> = {
    general: 'General Cargo',
    fragile: 'Fragile Items',
    perishable: 'Perishable Goods',
    hazardous: 'Hazardous Materials',
    livestock: 'Livestock',
    machinery: 'Heavy Machinery',
  };
  return labels[type] || type;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return `ODL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function generateWaybillNumber(): string {
  const prefix = 'WB';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${date}${rand}`;
}
