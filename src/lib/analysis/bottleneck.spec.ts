import { describe, expect, test } from 'vitest';
import type { Process, ProcessStep, StepId, ProcessId } from '@/types/process';
import { identifyBottlenecks } from './bottleneck';

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

describe('identifyBottlenecks', () => {
  test('returns empty array for empty process', () => {
    const process = createMockProcess([]);
    expect(identifyBottlenecks(process)).toEqual([]);
  });

  test('identifies step with duration > 2x average', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, estimatedDuration: 30 }),
      createMockStep({ id: 'step-2' as StepId, estimatedDuration: 30 }),
      createMockStep({ id: 'step-3' as StepId, estimatedDuration: 150 }), // avg=70, 2x=140, 150>140
    ]);
    const bottlenecks = identifyBottlenecks(process);
    expect(bottlenecks).toContain('step-3');
  });

  test('identifies step with most pain points', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, painPoints: ['one issue'] }),
      createMockStep({ id: 'step-2' as StepId, painPoints: ['issue 1', 'issue 2', 'issue 3'] }),
      createMockStep({ id: 'step-3' as StepId, painPoints: [] }),
    ]);
    const bottlenecks = identifyBottlenecks(process);
    expect(bottlenecks).toContain('step-2');
  });

  test('identifies step with waiting/delay pain points', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, painPoints: ['everything works fine'] }),
      createMockStep({ id: 'step-2' as StepId, painPoints: ['always waiting for approval'] }),
    ]);
    const bottlenecks = identifyBottlenecks(process);
    expect(bottlenecks).toContain('step-2');
  });

  test('identifies step with blocked status', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, painPoints: [] }),
      createMockStep({ id: 'step-2' as StepId, painPoints: ['often blocked by dependencies'] }),
    ]);
    const bottlenecks = identifyBottlenecks(process);
    expect(bottlenecks).toContain('step-2');
  });

  test('identifies single point of failure (unique role with long duration)', () => {
    const process = createMockProcess([
      createMockStep({
        id: 'step-1' as StepId,
        responsibleRole: 'Team Lead',
        estimatedDuration: 30,
      }),
      createMockStep({
        id: 'step-2' as StepId,
        responsibleRole: 'Specialist',
        estimatedDuration: 60,
      }), // unique role, above avg
      createMockStep({
        id: 'step-3' as StepId,
        responsibleRole: 'Team Lead',
        estimatedDuration: 30,
      }),
    ]);
    const bottlenecks = identifyBottlenecks(process);
    expect(bottlenecks).toContain('step-2');
  });

  test('returns multiple bottlenecks when criteria match multiple steps', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, estimatedDuration: 200 }), // long duration
      createMockStep({ id: 'step-2' as StepId, painPoints: ['delay', 'waiting'] }), // waiting keywords
      createMockStep({ id: 'step-3' as StepId, estimatedDuration: 30 }),
    ]);
    const bottlenecks = identifyBottlenecks(process);
    expect(bottlenecks.length).toBeGreaterThanOrEqual(2);
  });

  test('does not flag efficient process with no issues', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, responsibleRole: 'A', estimatedDuration: 30 }),
      createMockStep({ id: 'step-2' as StepId, responsibleRole: 'A', estimatedDuration: 30 }),
      createMockStep({ id: 'step-3' as StepId, responsibleRole: 'A', estimatedDuration: 30 }),
    ]);
    const bottlenecks = identifyBottlenecks(process);
    expect(bottlenecks).toHaveLength(0);
  });
});
