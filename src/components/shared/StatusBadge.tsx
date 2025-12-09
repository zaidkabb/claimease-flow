import { ClaimStatus } from '@/types/claims';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

const statusConfig: Record<ClaimStatus, { label: string; className: string }> = {
  processing: { label: 'Processing', className: 'status-processing' },
  hitl_review: { label: 'HITL Review', className: 'status-hitl' },
  approved: { label: 'Approved', className: 'status-approved' },
  rejected: { label: 'Rejected', className: 'status-rejected' },
  pending: { label: 'Pending', className: 'status-pending' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
