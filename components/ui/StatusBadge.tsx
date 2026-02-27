import { cn, getStatusColor, ShipmentStatus } from '@/lib/utils';

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colors = getStatusColor(status);
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium",
      colors.bg,
      colors.text,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs',
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
      {label}
    </span>
  );
}
