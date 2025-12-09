import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/shared/StatsCard';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfidenceIndicator } from '@/components/shared/ConfidenceIndicator';
import { mockClaims } from '@/data/mockData';
import { Claim } from '@/types/claims';
import { ClipboardCheck, AlertTriangle, Clock, TrendingUp, Eye } from 'lucide-react';

export default function AdjusterDashboard() {
  const navigate = useNavigate();
  
  const pendingReviewClaims = mockClaims.filter(c => 
    c.status === 'hitl_review' || c.status === 'processing'
  );
  
  const stats = {
    pendingReview: pendingReviewClaims.length,
    flaggedClaims: mockClaims.filter(c => c.flagsCount > 0).length,
    avgConfidence: Math.round(mockClaims.reduce((acc, c) => acc + c.confidence, 0) / mockClaims.length),
    reviewedToday: 12,
  };

  const columns = [
    { key: 'id', header: 'Claim ID' },
    { 
      key: 'confidence', 
      header: 'Confidence',
      render: (claim: Claim) => <ConfidenceIndicator value={claim.confidence} showLabel={false} />
    },
    { 
      key: 'flagsCount', 
      header: 'Flags',
      render: (claim: Claim) => (
        <span className={claim.flagsCount > 0 ? 'text-warning font-medium' : 'text-muted-foreground'}>
          {claim.flagsCount}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (claim: Claim) => <StatusBadge status={claim.status} />
    },
    { 
      key: 'claimType', 
      header: 'Type',
      render: (claim: Claim) => <span className="capitalize">{claim.claimType}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (claim: Claim) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/claim/${claim.id}`);
          }}
          className="gap-1"
        >
          <Eye className="h-3 w-3" />
          Review
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Adjuster Dashboard</h1>
          <p className="text-muted-foreground">Review AI-processed claims requiring human oversight</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={ClipboardCheck}
          />
          <StatsCard
            title="Flagged Claims"
            value={stats.flaggedClaims}
            icon={AlertTriangle}
            iconColor="text-warning"
          />
          <StatsCard
            title="Avg Confidence"
            value={`${stats.avgConfidence}%`}
            icon={TrendingUp}
            iconColor="text-success"
          />
          <StatsCard
            title="Reviewed Today"
            value={stats.reviewedToday}
            icon={Clock}
            iconColor="text-info"
          />
        </div>

        {/* Claims Pending Review */}
        <Card>
          <CardHeader>
            <CardTitle>Claims Pending Review</CardTitle>
            <CardDescription>
              Claims requiring human-in-the-loop validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={pendingReviewClaims}
              columns={columns}
              onRowClick={(claim) => navigate(`/claim/${claim.id}`)}
              emptyMessage="No claims pending review"
            />
          </CardContent>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Low Confidence Claims</CardTitle>
              <CardDescription>Claims with confidence below 70%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockClaims
                  .filter(c => c.confidence < 70)
                  .slice(0, 3)
                  .map(claim => (
                    <div
                      key={claim.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                      onClick={() => navigate(`/claim/${claim.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <div>
                          <p className="font-medium text-sm">Claim #{claim.id}</p>
                          <p className="text-xs text-muted-foreground capitalize">{claim.claimType}</p>
                        </div>
                      </div>
                      <ConfidenceIndicator value={claim.confidence} showLabel={false} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High Flag Count</CardTitle>
              <CardDescription>Claims with multiple issues detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockClaims
                  .filter(c => c.flagsCount >= 2)
                  .sort((a, b) => b.flagsCount - a.flagsCount)
                  .slice(0, 3)
                  .map(claim => (
                    <div
                      key={claim.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                      onClick={() => navigate(`/claim/${claim.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <div>
                          <p className="font-medium text-sm">Claim #{claim.id}</p>
                          <p className="text-xs text-muted-foreground capitalize">{claim.claimType}</p>
                        </div>
                      </div>
                      <span className="text-destructive font-medium">
                        {claim.flagsCount} flags
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
