import type { Process, ProcessFrequency, ProcessStep } from '@/types/process';
import type { Severity, WasteInstance, WasteType } from '@/types/analysis';

const WASTE_KEYWORDS: Record<WasteType, string[]> = {
  transportation: ['transfer', 'move', 'send', 'email', 'forward', 'pass', 'handoff', 'route'],
  inventory: ['backlog', 'queue', 'pile up', 'accumulate', 'batch', 'stack'],
  motion: ['search', 'look for', 'find', 'locate', 'navigate', 'switch between'],
  waiting: ['wait', 'delay', 'pending', 'hold', 'blocked', 'stuck', 'idle'],
  overproduction: ['excess', 'extra', 'unused', 'unnecessary', 'redundant', 'duplicate'],
  overprocessing: ['approval', 'review', 'sign-off', 'multiple checks', 'double entry', 're-enter'],
  defects: ['error', 'rework', 'fix', 'correct', 'mistake', 'redo', 'reject', 'bug', 'issue'],
  skills: ['manual', 'automate', 'repetitive', 'tedious', 'mundane', 'copy paste', 'routine'],
};

const SEVERITY_KEYWORDS: Record<Severity, string[]> = {
  high: ['critical', 'major', 'always', 'every time', 'significant', 'constant', 'severe'],
  medium: ['often', 'frequently', 'sometimes', 'moderate', 'regular'],
  low: ['occasionally', 'minor', 'rarely', 'slight', 'infrequent'],
};

const FREQUENCY_MULTIPLIER: Record<ProcessFrequency, number> = {
  multiple_daily: 5,
  daily: 4,
  weekly: 3,
  monthly: 2,
  quarterly: 1,
  ad_hoc: 1,
};

function containsKeyword(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
}

function assignSeverity(
  painPointText: string,
  stepDuration: number,
  frequency: ProcessFrequency
): Severity {
  const lowerText = painPointText.toLowerCase();

  for (const [severity, keywords] of Object.entries(SEVERITY_KEYWORDS) as [Severity, string[]][]) {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      return severity;
    }
  }

  const impactScore = stepDuration * FREQUENCY_MULTIPLIER[frequency];
  if (impactScore > 200) return 'high';
  if (impactScore > 50) return 'medium';
  return 'low';
}

function detectWasteInStep(
  step: ProcessStep,
  wasteType: WasteType,
  frequency: ProcessFrequency
): WasteInstance | null {
  const keywords = WASTE_KEYWORDS[wasteType];
  const allText = [step.name, step.description, ...step.painPoints].join(' ');

  if (!containsKeyword(allText, keywords)) {
    return null;
  }

  const relevantPainPoint =
    step.painPoints.find((pp) => containsKeyword(pp, keywords)) || step.description;

  return {
    type: wasteType,
    stepId: step.id,
    description: relevantPainPoint,
    severity: assignSeverity(relevantPainPoint, step.estimatedDuration, frequency),
    estimatedImpact: generateImpactDescription(wasteType, step, frequency),
  };
}

function generateImpactDescription(
  wasteType: WasteType,
  step: ProcessStep,
  frequency: ProcessFrequency
): string {
  const frequencyLabel: Record<ProcessFrequency, string> = {
    multiple_daily: 'multiple times daily',
    daily: 'daily',
    weekly: 'weekly',
    monthly: 'monthly',
    quarterly: 'quarterly',
    ad_hoc: 'as needed',
  };

  const timeWasted = step.estimatedDuration;
  const freqText = frequencyLabel[frequency];

  const impactTemplates: Record<WasteType, string> = {
    transportation: `Unnecessary data/material movement taking ~${timeWasted} min ${freqText}`,
    inventory: `Work piling up, causing delays and context switching ${freqText}`,
    motion: `Time spent searching/navigating instead of productive work ${freqText}`,
    waiting: `Idle time of ~${timeWasted} min while awaiting input/approval ${freqText}`,
    overproduction: `Creating more than needed, wasting resources ${freqText}`,
    overprocessing: `Excessive processing/approvals adding ~${timeWasted} min ${freqText}`,
    defects: `Errors requiring rework, adding time and frustration ${freqText}`,
    skills: `Human potential underutilized on automatable tasks ${freqText}`,
  };

  return impactTemplates[wasteType];
}

export function detectTransportationWaste(
  steps: ProcessStep[],
  frequency: ProcessFrequency
): WasteInstance[] {
  return steps
    .map((step) => detectWasteInStep(step, 'transportation', frequency))
    .filter(Boolean) as WasteInstance[];
}

export function detectInventoryWaste(
  steps: ProcessStep[],
  frequency: ProcessFrequency
): WasteInstance[] {
  const wastes: WasteInstance[] = [];

  for (const step of steps) {
    const waste = detectWasteInStep(step, 'inventory', frequency);
    if (waste) wastes.push(waste);
  }

  // Also detect inventory waste from multiple steps with same output (work piling up)
  const outputCounts = new Map<string, ProcessStep[]>();
  for (const step of steps) {
    for (const output of step.outputs) {
      const key = output.toLowerCase().trim();
      if (!outputCounts.has(key)) {
        outputCounts.set(key, []);
      }
      outputCounts.get(key)!.push(step);
    }
  }

  for (const [output, duplicateSteps] of outputCounts) {
    if (duplicateSteps.length > 1) {
      wastes.push({
        type: 'inventory',
        stepId: duplicateSteps[0].id,
        description: `Multiple steps producing same output "${output}" may indicate work-in-progress buildup`,
        severity: 'medium',
        estimatedImpact: `Potential inventory waste with ${duplicateSteps.length} steps producing similar outputs`,
      });
    }
  }

  return wastes;
}

export function detectMotionWaste(
  steps: ProcessStep[],
  frequency: ProcessFrequency
): WasteInstance[] {
  return steps
    .map((step) => detectWasteInStep(step, 'motion', frequency))
    .filter(Boolean) as WasteInstance[];
}

export function detectWaitingWaste(
  steps: ProcessStep[],
  frequency: ProcessFrequency
): WasteInstance[] {
  return steps
    .map((step) => detectWasteInStep(step, 'waiting', frequency))
    .filter(Boolean) as WasteInstance[];
}

export function detectOverproductionWaste(
  steps: ProcessStep[],
  frequency: ProcessFrequency
): WasteInstance[] {
  return steps
    .map((step) => detectWasteInStep(step, 'overproduction', frequency))
    .filter(Boolean) as WasteInstance[];
}

export function detectOverprocessingWaste(
  steps: ProcessStep[],
  frequency: ProcessFrequency
): WasteInstance[] {
  return steps
    .map((step) => detectWasteInStep(step, 'overprocessing', frequency))
    .filter(Boolean) as WasteInstance[];
}

export function detectDefectsWaste(
  steps: ProcessStep[],
  frequency: ProcessFrequency
): WasteInstance[] {
  return steps
    .map((step) => detectWasteInStep(step, 'defects', frequency))
    .filter(Boolean) as WasteInstance[];
}

export function detectSkillsWaste(
  steps: ProcessStep[],
  frequency: ProcessFrequency
): WasteInstance[] {
  return steps
    .map((step) => detectWasteInStep(step, 'skills', frequency))
    .filter(Boolean) as WasteInstance[];
}

export function detectWastes(process: Process): WasteInstance[] {
  const { steps, frequency } = process;

  const allWastes: WasteInstance[] = [
    ...detectTransportationWaste(steps, frequency),
    ...detectInventoryWaste(steps, frequency),
    ...detectMotionWaste(steps, frequency),
    ...detectWaitingWaste(steps, frequency),
    ...detectOverproductionWaste(steps, frequency),
    ...detectOverprocessingWaste(steps, frequency),
    ...detectDefectsWaste(steps, frequency),
    ...detectSkillsWaste(steps, frequency),
  ];

  // Remove duplicates (same type + stepId)
  const seen = new Set<string>();
  return allWastes.filter((waste) => {
    const key = `${waste.type}-${waste.stepId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
