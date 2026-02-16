import type { Process, ProcessStep } from '@/types/process';
import type { ProcessMetrics } from '@/types/analysis';

export function calculateLeadTime(steps: ProcessStep[]): number {
  if (steps.length === 0) return 0;
  return steps.reduce((total, step) => total + step.estimatedDuration, 0);
}

export function calculateCycleTime(steps: ProcessStep[]): number {
  if (steps.length === 0) return 0;
  // Cycle time excludes waiting/delay steps (those with "wait" or "pending" in name/description)
  const waitingKeywords = ['wait', 'pending', 'queue', 'hold', 'approval'];
  return steps
    .filter((step) => {
      const lowerName = step.name.toLowerCase();
      const lowerDesc = step.description.toLowerCase();
      return !waitingKeywords.some((kw) => lowerName.includes(kw) || lowerDesc.includes(kw));
    })
    .reduce((total, step) => total + step.estimatedDuration, 0);
}

export function calculateProcessEfficiency(leadTime: number, cycleTime: number): number {
  if (leadTime === 0) return 0;
  return Math.round((cycleTime / leadTime) * 100);
}

export function calculateTouchPoints(steps: ProcessStep[]): number {
  if (steps.length === 0) return 0;

  // Count unique responsible roles
  const uniqueRoles = new Set(steps.map((s) => s.responsibleRole.toLowerCase().trim()));

  // Count handoffs (role changes between consecutive steps)
  let handoffs = 0;
  for (let i = 1; i < steps.length; i++) {
    const prevRole = steps[i - 1].responsibleRole.toLowerCase().trim();
    const currRole = steps[i].responsibleRole.toLowerCase().trim();
    if (prevRole !== currRole) {
      handoffs++;
    }
  }

  return uniqueRoles.size + handoffs;
}

export function calculateFirstPassYield(steps: ProcessStep[]): number {
  if (steps.length === 0) return 100;

  // Estimate based on defect-related pain points
  const defectKeywords = ['error', 'rework', 'fix', 'correct', 'mistake', 'redo', 'reject'];

  const stepsWithDefects = steps.filter((step) =>
    step.painPoints.some((pp) => defectKeywords.some((kw) => pp.toLowerCase().includes(kw)))
  );

  // Each step with defects reduces yield by ~10%
  const defectPenalty = stepsWithDefects.length * 10;
  return Math.max(0, Math.min(100, 100 - defectPenalty));
}

export function calculateMetrics(process: Process): ProcessMetrics {
  const leadTime = calculateLeadTime(process.steps);
  const cycleTime = calculateCycleTime(process.steps);

  return {
    leadTime,
    cycleTime,
    processEfficiency: calculateProcessEfficiency(leadTime, cycleTime),
    firstPassYield: calculateFirstPassYield(process.steps),
    touchPoints: calculateTouchPoints(process.steps),
  };
}
