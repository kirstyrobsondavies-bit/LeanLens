import type { Process, ProcessStep, StepId } from '@/types/process';

export function identifyBottlenecks(process: Process): StepId[] {
  const { steps } = process;

  if (steps.length === 0) return [];

  const bottlenecks: StepId[] = [];

  // Calculate average duration
  const totalDuration = steps.reduce((sum, s) => sum + s.estimatedDuration, 0);
  const avgDuration = totalDuration / steps.length;

  // Identify bottlenecks based on multiple criteria
  for (const step of steps) {
    const isBottleneck = isStepBottleneck(step, avgDuration, steps);
    if (isBottleneck) {
      bottlenecks.push(step.id);
    }
  }

  return bottlenecks;
}

function isStepBottleneck(
  step: ProcessStep,
  avgDuration: number,
  allSteps: ProcessStep[]
): boolean {
  // Criterion 1: Duration > 2x average
  if (step.estimatedDuration > avgDuration * 2) {
    return true;
  }

  // Criterion 2: Most pain points (top quartile)
  const painPointCounts = allSteps.map((s) => s.painPoints.length);
  const maxPainPoints = Math.max(...painPointCounts);
  if (
    maxPainPoints > 0 &&
    step.painPoints.length === maxPainPoints &&
    step.painPoints.length >= 2
  ) {
    return true;
  }

  // Criterion 3: Contains waiting/delay keywords in pain points
  const waitingKeywords = ['wait', 'delay', 'pending', 'blocked', 'stuck', 'bottleneck', 'slow'];
  const hasWaitingPainPoint = step.painPoints.some((pp) =>
    waitingKeywords.some((kw) => pp.toLowerCase().includes(kw))
  );
  if (hasWaitingPainPoint) {
    return true;
  }

  // Criterion 4: Single point of failure (unique role not shared with other steps)
  const roleCounts = new Map<string, number>();
  for (const s of allSteps) {
    const role = s.responsibleRole.toLowerCase().trim();
    roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
  }
  const stepRole = step.responsibleRole.toLowerCase().trim();
  if (roleCounts.get(stepRole) === 1 && step.estimatedDuration > avgDuration) {
    return true;
  }

  return false;
}
