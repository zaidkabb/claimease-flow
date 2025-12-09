import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/shared/StatsCard';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockClaims } from '@/data/mockData';
import { Claim } from '@/types/claims';
import { FileText, Clock, CheckCircle, XCircle, Upload, MoreHorizontal, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  
  const stats = {
    total: mockClaims.length,
    pending: mockClaims.filter(c => c.status === 'hitl_review' || c.status === 'processing').length,
    approved: mockClaims.filter(c => c.status === 'approved').length,
    rejected: mockClaims.filter(c => c.status === 'rejected').length,
  };

  const columns = [
    { key: 'id', header: 'Claim ID' },
    { 
      key: 'status', 
      header: 'Status',
      render: (claim: Claim) => <StatusBadge status={claim.status} />
    },
    { key: 'claimType', header: 'Type', render: (claim: Claim) => (
      <span className="capitalize">{claim.claimType}</span>
    )},
    { key: 'createdAt', header: 'Submitted', render: (claim: Claim) => (
      new Date(claim.createdAt).toLocaleDateString()
    )},
    {
      key: 'actions',
      header: 'Actions',
      render: (claim: Claim) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/claim/${claim.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Claims Dashboard</h1>
            <p className="text-muted-foreground">Manage and track your insurance claims</p>
          </div>
          <Button onClick={() => navigate('/customer/upload')} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload New Claim
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Claims"
            value={stats.total}
            icon={FileText}
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
            iconColor="text-warning"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            iconColor="text-success"
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            iconColor="text-destructive"
          />
        </div>

        {/* Recent Claims Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Claims</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/customer/claims')}>
              View All Claims
            </Button>
          </div>
          <DataTable
            data={mockClaims.slice(0, 5)}
            columns={columns}
            onRowClick={(claim) => navigate(`/claim/${claim.id}`)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
