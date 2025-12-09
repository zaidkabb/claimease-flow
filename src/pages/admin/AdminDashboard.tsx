import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/shared/StatsCard';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockClaims, mockSystemLogs, mockAnalytics } from '@/data/mockData';
import { Claim, SystemLog } from '@/types/claims';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const claimColumns = [
    { key: 'id', header: 'Claim ID' },
    { key: 'policyNumber', header: 'Policy Num' },
    { 
      key: 'status', 
      header: 'Status',
      render: (claim: Claim) => <StatusBadge status={claim.status} />
    },
    { 
      key: 'assignedAdjuster', 
      header: 'Adjuster',
      render: (claim: Claim) => claim.assignedAdjuster || '-'
    },
    { key: 'createdAt', header: 'Created', render: (claim: Claim) => (
      new Date(claim.createdAt).toLocaleDateString()
    )},
    {
      key: 'actions',
      header: 'Actions',
      render: (claim: Claim) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-7 px-2">
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-7 px-2 text-destructive hover:text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  const logColumns = [
    { 
      key: 'timestamp', 
      header: 'Time',
      render: (log: SystemLog) => new Date(log.timestamp).toLocaleTimeString()
    },
    { 
      key: 'level', 
      header: 'Level',
      render: (log: SystemLog) => (
        <span className={cn(
          'status-badge',
          log.level === 'error' && 'status-rejected',
          log.level === 'warning' && 'status-processing',
          log.level === 'info' && 'status-hitl'
        )}>
          {log.level}
        </span>
      )
    },
    { key: 'message', header: 'Message' },
    { key: 'source', header: 'Source' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Claims"
            value={mockAnalytics.totalClaims.toLocaleString()}
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pending HITL"
            value={mockAnalytics.pendingHITL}
            icon={Clock}
            iconColor="text-warning"
          />
          <StatsCard
            title="CAG Corrections"
            value={mockAnalytics.cagCorrections}
            icon={AlertTriangle}
            iconColor="text-info"
          />
          <StatsCard
            title="Resolved Claims"
            value={mockAnalytics.resolvedClaims.toLocaleString()}
            icon={CheckCircle}
            iconColor="text-success"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="claims">Recent Claims</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Claims Per Day Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Claims Per Day</CardTitle>
                  <CardDescription>Daily claim submission trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockAnalytics.claimsPerDay}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                          className="text-muted-foreground"
                        />
                        <YAxis className="text-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Correction Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Correction Trends</CardTitle>
                  <CardDescription>CAG corrections and errors over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockAnalytics.correctionTrends}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                          className="text-muted-foreground"
                        />
                        <YAxis className="text-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="corrections" 
                          stroke="hsl(var(--warning))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--warning))' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="errors" 
                          stroke="hsl(var(--destructive))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--destructive))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Confidence Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>AI Confidence Metrics</CardTitle>
                <CardDescription>Distribution of confidence scores across claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-success/10">
                    <p className="text-3xl font-bold text-success">68%</p>
                    <p className="text-sm text-muted-foreground">High Confidence (80%+)</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-warning/10">
                    <p className="text-3xl font-bold text-warning">24%</p>
                    <p className="text-sm text-muted-foreground">Medium (60-80%)</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-destructive/10">
                    <p className="text-3xl font-bold text-destructive">8%</p>
                    <p className="text-sm text-muted-foreground">Low (&lt;60%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle>Recent Claims</CardTitle>
                <CardDescription>All claims in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={mockClaims}
                  columns={claimColumns}
                  onRowClick={(claim) => navigate(`/claim/${claim.id}`)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system activity and events</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={mockSystemLogs}
                  columns={logColumns}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Average Processing Time</span>
                    <span className="font-medium">2.3 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Auto-Approval Rate</span>
                    <span className="font-medium text-success">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">HITL Escalation Rate</span>
                    <span className="font-medium text-warning">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rejection Rate</span>
                    <span className="font-medium text-destructive">10%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Claims Agent Accuracy</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Verifier Agent Accuracy</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CAG Correction Rate</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">False Positive Rate</span>
                    <span className="font-medium text-success">3%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
