import { describe, expect, test } from 'vitest';
import fc from 'fast-check';
import type { Process, ProcessStep, StepId, ProcessId } from '@/types/process';
import {
  calculateCycleTime,
  calculateFirstPassYield,
  calculateLeadTime,
  calculateMetrics,
  calculateProcessEfficiency,
  calculateTouchPoints,
} from './metrics';

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

describe('calculateLeadTime', () => {
  test('returns 0 for empty steps array', () => {
    expect(calculateLeadTime([])).toBe(0);
  });

  test('returns duration for single step', () => {
    const steps = [createMockStep({ estimatedDuration: 45 })];
    expect(calculateLeadTime(steps)).toBe(45);
  });

  test('sums durations for multiple steps', () => {
    const steps = [
      createMockStep({ estimatedDuration: 30 }),
      createMockStep({ estimatedDuration: 15 }),
      createMockStep({ estimatedDuration: 60 }),
    ];
    expect(calculateLeadTime(steps)).toBe(105);
  });
});

describe('calculateCycleTime', () => {
  test('returns 0 for empty steps array', () => {
    expect(calculateCycleTime([])).toBe(0);
  });

  test('excludes waiting steps from cycle time', () => {
    const steps = [
      createMockStep({ name: 'Process data', estimatedDuration: 30 }),
      createMockStep({ name: 'Wait for approval', estimatedDuration: 120 }),
      createMockStep({ name: 'Submit report', estimatedDuration: 15 }),
    ];
    expect(calculateCycleTime(steps)).toBe(45); // 30 + 15, excludes waiting step
  });

  test('excludes pending steps from cycle time', () => {
    const steps = [
      createMockStep({ name: 'Review', estimatedDuration: 20 }),
      createMockStep({ description: 'Pending manager sign-off', estimatedDuration: 60 }),
    ];
    expect(calculateCycleTime(steps)).toBe(20);
  });

  test('returns full duration when no waiting steps', () => {
    const steps = [
      createMockStep({ name: 'Step 1', estimatedDuration: 10 }),
      createMockStep({ name: 'Step 2', estimatedDuration: 20 }),
    ];
    expect(calculateCycleTime(steps)).toBe(30);
  });
});

describe('calculateProcessEfficiency', () => {
  test('returns 0 when lead time is 0', () => {
    expect(calculateProcessEfficiency(0, 0)).toBe(0);
  });

  test('returns 100 when cycle time equals lead time', () => {
    expect(calculateProcessEfficiency(100, 100)).toBe(100);
  });

  test('returns 50 when cycle time is half of lead time', () => {
    expect(calculateProcessEfficiency(100, 50)).toBe(50);
  });

  test('rounds to nearest integer', () => {
    expect(calculateProcessEfficiency(100, 33)).toBe(33);
  });
});

describe('calculateProcessEfficiency property tests', () => {
  test('efficiency is always between 0 and 100 when cycle <= lead', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        (lead, cycle) => {
          const actualCycle = Math.min(cycle, lead);
          const efficiency = calculateProcessEfficiency(lead, actualCycle);
          return efficiency >= 0 && efficiency <= 100;
        }
      )
    );
  });
});

describe('calculateTouchPoints', () => {
  test('returns 0 for empty steps array', () => {
    expect(calculateTouchPoints([])).toBe(0);
  });

  test('counts unique roles', () => {
    const steps = [
      createMockStep({ responsibleRole: 'Analyst' }),
      createMockStep({ responsibleRole: 'Analyst' }),
      createMockStep({ responsibleRole: 'Manager' }),
    ];
    // 2 unique roles + 1 handoff (Analyst -> Manager)
    expect(calculateTouchPoints(steps)).toBe(3);
  });

  test('counts handoffs between different roles', () => {
    const steps = [
      createMockStep({ responsibleRole: 'A' }),
      createMockStep({ responsibleRole: 'B' }),
      createMockStep({ responsibleRole: 'A' }),
    ];
    // 2 unique roles + 2 handoffs (A->B, B->A)
    expect(calculateTouchPoints(steps)).toBe(4);
  });

  test('handles case-insensitive role matching', () => {
    const steps = [
      createMockStep({ responsibleRole: 'Analyst' }),
      createMockStep({ responsibleRole: 'analyst' }),
    ];
    // 1 unique role + 0 handoffs
    expect(calculateTouchPoints(steps)).toBe(1);
  });
});

describe('calculateFirstPassYield', () => {
  test('returns 100 for empty steps array', () => {
    expect(calculateFirstPassYield([])).toBe(100);
  });

  test('returns 100 when no defect-related pain points', () => {
    const steps = [
      createMockStep({ painPoints: ['slow process'] }),
      createMockStep({ painPoints: ['manual entry'] }),
    ];
    expect(calculateFirstPassYield(steps)).toBe(100);
  });

  test('reduces yield by 10% per step with defects', () => {
    const steps = [
      createMockStep({ painPoints: ['frequent errors in data'] }),
      createMockStep({ painPoints: [] }),
    ];
    expect(calculateFirstPassYield(steps)).toBe(90);
  });

  test('multiple steps with defects reduce yield further', () => {
    const steps = [
      createMockStep({ painPoints: ['needs rework often'] }),
      createMockStep({ painPoints: ['fix mistakes daily'] }),
      createMockStep({ painPoints: ['must correct entries'] }),
    ];
    expect(calculateFirstPassYield(steps)).toBe(70);
  });

  test('yield never goes below 0', () => {
    const steps = Array.from({ length: 15 }, () =>
      createMockStep({ painPoints: ['rework required'] })
    );
    expect(calculateFirstPassYield(steps)).toBe(0);
  });
});

describe('calculateMetrics', () => {
  test('returns complete metrics object for process', () => {
    const process: Process = {
      id: 'process-1' as ProcessId,
      name: 'Test Process',
      purpose: 'Testing',
      trigger: 'Manual',
      frequency: 'daily',
      stakeholders: ['Team A'],
      steps: [
        createMockStep({ name: 'Step 1', estimatedDuration: 30, responsibleRole: 'A' }),
        createMockStep({ name: 'Wait for approval', estimatedDuration: 60, responsibleRole: 'B' }),
        createMockStep({ name: 'Step 3', estimatedDuration: 10, responsibleRole: 'A' }),
      ],
    };

    const metrics = calculateMetrics(process);

    expect(metrics).toEqual({
      leadTime: 100,
      cycleTime: 40, // excludes waiting step
      processEfficiency: 40,
      firstPassYield: 100,
      touchPoints: 4, // 2 roles + 2 handoffs
    });
  });
});

describe('calculateMetrics property tests', () => {
  test('lead time is always >= cycle time', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 1000 }), { minLength: 1, maxLength: 10 }),
        (durations) => {
          const steps = durations.map((d, i) =>
            createMockStep({
              id: `step-${i}` as StepId,
              estimatedDuration: d,
              responsibleRole: 'Role',
            })
          );
          const process: Process = {
            id: 'test' as ProcessId,
            name: 'Test',
            purpose: 'Test',
            trigger: 'Test',
            frequency: 'daily',
            stakeholders: [],
            steps,
          };
          const metrics = calculateMetrics(process);
          return metrics.leadTime >= metrics.cycleTime;
        }
      )
    );
  });
});
