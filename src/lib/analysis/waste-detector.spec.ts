import { describe, expect, test } from 'vitest';
import type { Process, ProcessStep, StepId, ProcessId } from '@/types/process';
import {
  detectDefectsWaste,
  detectInventoryWaste,
  detectMotionWaste,
  detectOverprocessingWaste,
  detectOverproductionWaste,
  detectSkillsWaste,
  detectTransportationWaste,
  detectWaitingWaste,
  detectWastes,
} from './waste-detector';

function createMockStep(overrides: Partial<ProcessStep> = {}): ProcessStep {
  return {
    id: 'step-1' as StepId,
    name: 'Test Step',
    description: 'A test step',
    responsibleRole: 'Analyst',
    estimatedDuration: 30,
    inputs: [],
    outputs: [],
    tools: [],
    painPoints: [],
    ...overrides,
  };
}

function createMockProcess(steps: ProcessStep[]): Process {
  return {
    id: 'process-1' as ProcessId,
    name: 'Test Process',
    purpose: 'Testing',
    trigger: 'Manual',
    frequency: 'daily',
    stakeholders: ['Team A'],
    steps,
  };
}

describe('detectTransportationWaste', () => {
  test('detects transportation waste from pain points', () => {
    const steps = [createMockStep({ painPoints: ['need to email data to another team'] })];
    const wastes = detectTransportationWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
    expect(wastes[0].type).toBe('transportation');
  });

  test('detects transportation from step description', () => {
    const steps = [createMockStep({ description: 'Transfer file to shared drive' })];
    const wastes = detectTransportationWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });

  test('returns empty array when no transportation waste', () => {
    const steps = [createMockStep({ painPoints: ['process is slow'] })];
    const wastes = detectTransportationWaste(steps, 'daily');
    expect(wastes).toHaveLength(0);
  });
});

describe('detectInventoryWaste', () => {
  test('detects inventory waste from pain points', () => {
    const steps = [createMockStep({ painPoints: ['requests pile up in the queue'] })];
    const wastes = detectInventoryWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
    expect(wastes[0].type).toBe('inventory');
  });

  test('detects inventory waste from duplicate outputs', () => {
    const steps = [
      createMockStep({ id: 'step-1' as StepId, outputs: ['report'] }),
      createMockStep({ id: 'step-2' as StepId, outputs: ['Report'] }), // same, different case
    ];
    const wastes = detectInventoryWaste(steps, 'daily');
    expect(wastes.length).toBeGreaterThanOrEqual(1);
    expect(wastes.some((w) => w.description.includes('Multiple steps'))).toBe(true);
  });
});

describe('detectMotionWaste', () => {
  test('detects motion waste from searching', () => {
    const steps = [createMockStep({ painPoints: ['have to search for the right document'] })];
    const wastes = detectMotionWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
    expect(wastes[0].type).toBe('motion');
  });

  test('detects motion waste from switching', () => {
    const steps = [createMockStep({ painPoints: ['switch between multiple systems'] })];
    const wastes = detectMotionWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });
});

describe('detectWaitingWaste', () => {
  test('detects waiting waste from delays', () => {
    const steps = [createMockStep({ painPoints: ['always waiting for manager approval'] })];
    const wastes = detectWaitingWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
    expect(wastes[0].type).toBe('waiting');
  });

  test('detects waiting from step name', () => {
    const steps = [createMockStep({ name: 'Wait for client feedback' })];
    const wastes = detectWaitingWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });

  test('detects blocked status', () => {
    const steps = [createMockStep({ painPoints: ['often blocked by dependencies'] })];
    const wastes = detectWaitingWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });
});

describe('detectOverproductionWaste', () => {
  test('detects overproduction from unnecessary work', () => {
    const steps = [createMockStep({ painPoints: ['create excess reports that no one reads'] })];
    const wastes = detectOverproductionWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
    expect(wastes[0].type).toBe('overproduction');
  });

  test('detects redundant work', () => {
    const steps = [createMockStep({ painPoints: ['redundant data entry in multiple places'] })];
    const wastes = detectOverproductionWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });
});

describe('detectOverprocessingWaste', () => {
  test('detects overprocessing from excessive approvals', () => {
    const steps = [
      createMockStep({ painPoints: ['requires multiple approvals from different managers'] }),
    ];
    const wastes = detectOverprocessingWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
    expect(wastes[0].type).toBe('overprocessing');
  });

  test('detects double entry', () => {
    const steps = [createMockStep({ painPoints: ['double entry required for compliance'] })];
    const wastes = detectOverprocessingWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });
});

describe('detectDefectsWaste', () => {
  test('detects defects from errors', () => {
    const steps = [createMockStep({ painPoints: ['frequent errors in data entry'] })];
    const wastes = detectDefectsWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
    expect(wastes[0].type).toBe('defects');
  });

  test('detects rework', () => {
    const steps = [createMockStep({ painPoints: ['often need to rework submissions'] })];
    const wastes = detectDefectsWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });

  test('detects fixes needed', () => {
    const steps = [createMockStep({ painPoints: ['must fix mistakes before proceeding'] })];
    const wastes = detectDefectsWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });
});

describe('detectSkillsWaste', () => {
  test('detects skills waste from manual work', () => {
    const steps = [createMockStep({ painPoints: ['lots of manual data entry'] })];
    const wastes = detectSkillsWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
    expect(wastes[0].type).toBe('skills');
  });

  test('detects automatable tasks', () => {
    const steps = [createMockStep({ painPoints: ['this could be automated easily'] })];
    const wastes = detectSkillsWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });

  test('detects repetitive work', () => {
    const steps = [createMockStep({ painPoints: ['repetitive copying between systems'] })];
    const wastes = detectSkillsWaste(steps, 'daily');
    expect(wastes).toHaveLength(1);
  });
});

describe('detectWastes', () => {
  test('returns empty array for clean process', () => {
    const process = createMockProcess([createMockStep({ name: 'Good step', painPoints: [] })]);
    const wastes = detectWastes(process);
    expect(wastes).toHaveLength(0);
  });

  test('detects multiple waste types in complex process', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, painPoints: ['email data to finance'] }),
      createMockStep({ id: 'step-2' as StepId, painPoints: ['wait for approval'] }),
      createMockStep({ id: 'step-3' as StepId, painPoints: ['manual data entry'] }),
      createMockStep({ id: 'step-4' as StepId, painPoints: ['fix errors from previous step'] }),
    ]);
    const wastes = detectWastes(process);
    expect(wastes.length).toBeGreaterThanOrEqual(4);

    const wasteTypes = wastes.map((w) => w.type);
    expect(wasteTypes).toContain('transportation');
    expect(wasteTypes).toContain('waiting');
    expect(wasteTypes).toContain('skills');
    expect(wasteTypes).toContain('defects');
  });

  test('removes duplicate wastes for same step', () => {
    const process = createMockProcess([
      createMockStep({
        id: 'step-1' as StepId,
        name: 'Manual step',
        description: 'Manual entry',
        painPoints: ['manual process', 'repetitive manual work'],
      }),
    ]);
    const wastes = detectWastes(process);
    const skillsWastes = wastes.filter((w) => w.type === 'skills' && w.stepId === 'step-1');
    expect(skillsWastes).toHaveLength(1); // Should deduplicate
  });

  test('assigns severity based on keywords', () => {
    const process = createMockProcess([
      createMockStep({ painPoints: ['critical error every time'] }),
    ]);
    const wastes = detectWastes(process);
    expect(wastes[0].severity).toBe('high');
  });

  test('assigns severity based on frequency and duration', () => {
    const process: Process = {
      ...createMockProcess([
        createMockStep({ estimatedDuration: 100, painPoints: ['manual work here'] }),
      ]),
      frequency: 'multiple_daily',
    };
    const wastes = detectWastes(process);
    // 100 * 5 = 500 > 200, should be high severity
    expect(wastes[0].severity).toBe('high');
  });

  test('generates impact descriptions', () => {
    const process = createMockProcess([createMockStep({ painPoints: ['wait for review'] })]);
    const wastes = detectWastes(process);
    expect(wastes[0].estimatedImpact).toContain('daily');
  });
});
