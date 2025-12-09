import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  iconColor = 'text-primary',
  className 
}: StatsCardProps) {
  return (
    <div className={cn('card-stats', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs mt-1',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={cn('h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center', iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
