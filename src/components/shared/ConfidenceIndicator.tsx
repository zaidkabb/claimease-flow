import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  value: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceIndicator({ value, showLabel = true, size = 'md' }: ConfidenceIndicatorProps) {
  const getConfidenceClass = () => {
    if (value >= 80) return 'confidence-high';
    if (value >= 60) return 'confidence-medium';
    return 'confidence-low';
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span className={cn('font-medium', getConfidenceClass(), sizeClasses[size])}>
      {value}%{showLabel && ' confidence'}
    </span>
  );
}
