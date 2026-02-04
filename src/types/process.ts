import type { Brand } from './brand';

export type ProcessId = Brand<string, 'ProcessId'>;
export type StepId = Brand<string, 'StepId'>;
export type AssessmentId = Brand<string, 'AssessmentId'>;

export type ProcessFrequency =
  | 'multiple_daily'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'ad_hoc';

export type ProcessStep = {
  id: StepId;
  name: string;
  description: string;
  responsibleRole: string;
  estimatedDuration: number; // minutes
  inputs: string[];
  outputs: string[];
  tools: string[];
  painPoints: string[];
};

export type Process = {
  id: ProcessId;
  name: string;
  purpose: string;
  trigger: string;
  frequency: ProcessFrequency;
  steps: ProcessStep[];
  stakeholders: string[];
};

export type ProcessAssessment = {
  id: AssessmentId;
  processId: ProcessId;
  createdAt: Date;
  updatedAt: Date;
  status: 'in_progress' | 'completed' | 'archived';
  currentStep: number;
  answers: Record<string, unknown>;
};
