import type { ProcessId, StepId } from './process';

export type WasteType =
  | 'transportation'
  | 'inventory'
  | 'motion'
  | 'waiting'
  | 'overproduction'
  | 'overprocessing'
  | 'defects'
  | 'skills';

export type Severity = 'low' | 'medium' | 'high';

export type WasteInstance = {
  type: WasteType;
  stepId: StepId;
  description: string;
  severity: Severity;
  estimatedImpact: string;
};

export type AutomationOpportunity = {
  stepId: StepId;
  potential: Severity;
  complexity: Severity;
  roiPotential: Severity;
  suggestedTools: string[];
  description: string;
};

export type ProcessMetrics = {
  leadTime: number; // minutes
  cycleTime: number; // minutes
  processEfficiency: number; // percentage (0-100)
  firstPassYield: number; // percentage (0-100)
  touchPoints: number;
};

export type ProcessAnalysis = {
  processId: ProcessId;
  metrics: ProcessMetrics;
  wastes: WasteInstance[];
  bottlenecks: StepId[];
  automationOpportunities: AutomationOpportunity[];
  overallScore: number; // 0-100
  recommendations: string[];
};
