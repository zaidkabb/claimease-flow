export type UserRole = 'customer' | 'adjuster' | 'admin';

export type ClaimStatus = 'processing' | 'hitl_review' | 'approved' | 'rejected' | 'pending';

export type ClaimType = 'collision' | 'theft' | 'fire' | 'flood' | 'liability' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
  editable?: boolean;
}

export interface AgentMessage {
  id: string;
  agent: 'claims' | 'verifier' | 'cag' | 'supervisor';
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface CAGCorrection {
  id: string;
  field: string;
  issue: string;
  suggestedValue: string;
  originalValue: string;
  status: 'pending' | 'approved' | 'rejected' | 'edited';
}

export interface Claim {
  id: string;
  policyNumber: string;
  incidentDate: string;
  claimType: ClaimType;
  status: ClaimStatus;
  confidence: number;
  flagsCount: number;
  createdAt: string;
  updatedAt: string;
  claimAmount?: number;
  description?: string;
  extractedFields?: ExtractedField[];
  agentMessages?: AgentMessage[];
  cagCorrections?: CAGCorrection[];
  assignedAdjuster?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

export interface AnalyticsData {
  totalClaims: number;
  pendingHITL: number;
  cagCorrections: number;
  resolvedClaims: number;
  averageConfidence: number;
  claimsPerDay: { date: string; count: number }[];
  correctionTrends: { date: string; corrections: number; errors: number }[];
}
