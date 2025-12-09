import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfidenceIndicator } from '@/components/shared/ConfidenceIndicator';
import { mockClaims } from '@/data/mockData';
import { CAGCorrection, AgentMessage } from '@/types/claims';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  Bot, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Edit2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function ClaimProcessing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const claim = mockClaims.find(c => c.id === id) || mockClaims[0];
  const [extractedFields, setExtractedFields] = useState(claim.extractedFields || []);
  const [corrections, setCorrections] = useState(claim.cagCorrections || []);
  const [expandedAgents, setExpandedAgents] = useState<string[]>(['claims', 'verifier', 'cag', 'supervisor']);

  const isReviewer = user?.role === 'adjuster' || user?.role === 'admin';

  const handleFieldEdit = (index: number, newValue: string) => {
    const updated = [...extractedFields];
    updated[index] = { ...updated[index], value: newValue };
    setExtractedFields(updated);
  };

  const handleCorrectionAction = (correctionId: string, action: 'approve' | 'reject' | 'edit') => {
    setCorrections(prev => 
      prev.map(c => c.id === correctionId ? { ...c, status: action === 'edit' ? 'pending' : action === 'approve' ? 'approved' : 'rejected' } : c)
    );
    toast({
      title: `Correction ${action}ed`,
      description: `The suggested correction has been ${action}ed.`,
    });
  };

  const handleFinalAction = (action: 'approve' | 'reject' | 'more_info') => {
    const messages = {
      approve: 'Claim has been approved successfully',
      reject: 'Claim has been rejected',
      more_info: 'Request for more information has been sent',
    };
    toast({
      title: action === 'approve' ? 'Claim Approved' : action === 'reject' ? 'Claim Rejected' : 'Info Requested',
      description: messages[action],
    });
    navigate(-1);
  };

  const toggleAgent = (agent: string) => {
    setExpandedAgents(prev => 
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
  };

  const agentConfig: Record<string, { label: string; color: string; icon: typeof Bot }> = {
    claims: { label: 'Claims Agent', color: 'text-primary', icon: Bot },
    verifier: { label: 'Verifier Agent', color: 'text-info', icon: CheckCircle },
    cag: { label: 'CAG Agent', color: 'text-warning', icon: AlertTriangle },
    supervisor: { label: 'Supervisor Agent', color: 'text-success', icon: Info },
  };

  const getMessageIcon = (type: AgentMessage['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Info className="h-4 w-4 text-info" />;
    }
  };

  const groupedMessages = (claim.agentMessages || []).reduce((acc, msg) => {
    if (!acc[msg.agent]) acc[msg.agent] = [];
    acc[msg.agent].push(msg);
    return acc;
  }, {} as Record<string, AgentMessage[]>);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Claim #{claim.id}</h1>
              <StatusBadge status={claim.status} />
            </div>
            <p className="text-muted-foreground">
              Policy: {claim.policyNumber} | Type: {claim.claimType} | Submitted: {new Date(claim.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Conversation Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Agent Conversation
                </CardTitle>
                <CardDescription>AI workflow processing log</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(agentConfig).map(([agentKey, config]) => (
                  <Collapsible
                    key={agentKey}
                    open={expandedAgents.includes(agentKey)}
                    onOpenChange={() => toggleAgent(agentKey)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-3 h-auto hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <config.icon className={cn('h-5 w-5', config.color)} />
                          <span className="font-medium">{config.label}</span>
                          {groupedMessages[agentKey] && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              {groupedMessages[agentKey].length} messages
                            </span>
                          )}
                        </div>
                        {expandedAgents.includes(agentKey) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3">
                      <div className="space-y-2 pl-7 border-l-2 border-muted ml-2">
                        {(groupedMessages[agentKey] || []).map((msg) => (
                          <div key={msg.id} className="flex gap-2 py-2">
                            {getMessageIcon(msg.type)}
                            <div>
                              <p className="text-sm text-foreground">{msg.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>

            {/* CAG Corrections Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  CAG Corrections
                </CardTitle>
                <CardDescription>AI-detected issues and suggested corrections</CardDescription>
              </CardHeader>
              <CardContent>
                {corrections.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No corrections needed</p>
                ) : (
                  <div className="space-y-4">
                    {corrections.map((correction) => (
                      <div
                        key={correction.id}
                        className={cn(
                          'p-4 rounded-lg border',
                          correction.status === 'approved' && 'bg-success/5 border-success/20',
                          correction.status === 'rejected' && 'bg-destructive/5 border-destructive/20',
                          correction.status === 'pending' && 'bg-warning/5 border-warning/20'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{correction.field}</p>
                            <p className="text-sm text-muted-foreground">{correction.issue}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span>
                                <span className="text-muted-foreground">Original:</span>{' '}
                                <span className="line-through text-destructive">{correction.originalValue}</span>
                              </span>
                              <span>
                                <span className="text-muted-foreground">Suggested:</span>{' '}
                                <span className="text-success font-medium">{correction.suggestedValue}</span>
                              </span>
                            </div>
                          </div>
                          {isReviewer && correction.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCorrectionAction(correction.id, 'approve')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCorrectionAction(correction.id, 'edit')}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCorrectionAction(correction.id, 'reject')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Extracted Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Extracted Fields</CardTitle>
                <CardDescription>AI-extracted information from document</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {extractedFields.map((field, index) => (
                    <div key={field.field} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          {field.field}
                        </label>
                        <ConfidenceIndicator value={field.confidence} showLabel={false} size="sm" />
                      </div>
                      {isReviewer && field.editable ? (
                        <Input
                          value={field.value}
                          onChange={(e) => handleFieldEdit(index, e.target.value)}
                          className="h-9"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded">
                          {field.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Final Approval Panel */}
            {isReviewer && (
              <Card>
                <CardHeader>
                  <CardTitle>Final Approval</CardTitle>
                  <CardDescription>Take action on this claim</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleFinalAction('approve')}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Claim
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => handleFinalAction('reject')}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Claim
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleFinalAction('more_info')}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Request More Info
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
