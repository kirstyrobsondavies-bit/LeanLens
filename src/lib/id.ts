import type { AssessmentId, ProcessId, StepId } from '@/types/process';

export function createProcessId(): ProcessId {
  return crypto.randomUUID() as ProcessId;
}

export function createStepId(): StepId {
  return crypto.randomUUID() as StepId;
}

export function createAssessmentId(): AssessmentId {
  return crypto.randomUUID() as AssessmentId;
}
