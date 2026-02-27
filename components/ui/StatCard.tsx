import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg?: string;
}

export default function StatCard({ label, value, change, changeType = 'neutral', icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-[var(--surface)] rounded-xl p-5 shadow-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium",
              changeType === 'positive' && "text-green-600",
              changeType === 'negative' && "text-red-600",
              changeType === 'neutral' && "text-gray-500",
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg || 'var(--orange-100)' }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
