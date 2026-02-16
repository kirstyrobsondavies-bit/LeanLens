import { describe, expect, test } from 'vitest';
import type { Process, ProcessStep, ProcessId, StepId } from '@/types/process';
import { analyzeProcess } from './analyze-process';

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

describe('analyzeProcess', () => {
  test('returns complete ProcessAnalysis object', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, name: 'Step 1' }),
      createMockStep({ id: 'step-2' as StepId, name: 'Step 2' }),
    ]);

    const analysis = analyzeProcess(process);

    expect(analysis).toHaveProperty('processId', 'process-1');
    expect(analysis).toHaveProperty('metrics');
    expect(analysis).toHaveProperty('wastes');
    expect(analysis).toHaveProperty('bottlenecks');
    expect(analysis).toHaveProperty('automationOpportunities');
    expect(analysis).toHaveProperty('overallScore');
    expect(analysis).toHaveProperty('recommendations');
  });

  test('calculates metrics correctly', () => {
    const process = createMockProcess([
      createMockStep({ estimatedDuration: 30 }),
      createMockStep({ estimatedDuration: 30 }),
    ]);

    const analysis = analyzeProcess(process);

    expect(analysis.metrics.leadTime).toBe(60);
    expect(analysis.metrics.cycleTime).toBe(60);
    expect(analysis.metrics.processEfficiency).toBe(100);
  });

  test('detects wastes from pain points', () => {
    const process = createMockProcess([
      createMockStep({ painPoints: ['manual data entry', 'waiting for approval'] }),
    ]);

    const analysis = analyzeProcess(process);

    expect(analysis.wastes.length).toBeGreaterThan(0);
    expect(analysis.wastes.some((w) => w.type === 'skills')).toBe(true);
    expect(analysis.wastes.some((w) => w.type === 'waiting')).toBe(true);
  });

  test('identifies bottlenecks', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId, estimatedDuration: 30 }),
      createMockStep({ id: 'step-2' as StepId, estimatedDuration: 30 }),
      createMockStep({ id: 'step-3' as StepId, estimatedDuration: 180 }), // avg=80, 2x=160, 180>160
    ]);

    const analysis = analyzeProcess(process);

    expect(analysis.bottlenecks).toContain('step-3');
  });

  test('identifies automation opportunities for all steps', () => {
    const process = createMockProcess([
      createMockStep({ id: 'step-1' as StepId }),
      createMockStep({ id: 'step-2' as StepId }),
    ]);

    const analysis = analyzeProcess(process);

    expect(analysis.automationOpportunities).toHaveLength(2);
  });

  test('calculates overall score', () => {
    const process = createMockProcess([createMockStep()]);

    const analysis = analyzeProcess(process);

    expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
    expect(analysis.overallScore).toBeLessThanOrEqual(100);
  });

  test('generates recommendations', () => {
    const process = createMockProcess([
      createMockStep({
        painPoints: ['manual work', 'errors frequently'],
        estimatedDuration: 120,
      }),
    ]);

    const analysis = analyzeProcess(process);

    expect(analysis.recommendations.length).toBeGreaterThan(0);
  });

  test('handles complex process with multiple issues', () => {
    const process = createMockProcess([
      createMockStep({
        id: 'step-1' as StepId,
        name: 'Data Collection',
        painPoints: ['manual data entry', 'copy paste from emails'],
        tools: ['Excel', 'Outlook'],
        estimatedDuration: 60,
        responsibleRole: 'Coordinator',
      }),
      createMockStep({
        id: 'step-2' as StepId,
        name: 'Manager Approval',
        painPoints: ['always waiting for manager', 'delayed responses'],
        estimatedDuration: 120,
        responsibleRole: 'Manager',
      }),
      createMockStep({
        id: 'step-3' as StepId,
        name: 'Report Generation',
        painPoints: ['errors in calculations', 'need to rework often'],
        tools: ['Excel'],
        estimatedDuration: 45,
        responsibleRole: 'Coordinator',
      }),
    ]);

    const analysis = analyzeProcess(process);

    // Should detect multiple waste types
    const wasteTypes = new Set(analysis.wastes.map((w) => w.type));
    expect(wasteTypes.size).toBeGreaterThanOrEqual(3);

    // Should identify bottlenecks
    expect(analysis.bottlenecks.length).toBeGreaterThan(0);

    // Should have automation opportunities
    expect(analysis.automationOpportunities.length).toBe(3);

    // Score should reflect issues
    expect(analysis.overallScore).toBeLessThan(80);

    // Should generate multiple recommendations
    expect(analysis.recommendations.length).toBeGreaterThanOrEqual(3);
  });

  test('good process gets high score', () => {
    const process = createMockProcess([
      createMockStep({
        id: 'step-1' as StepId,
        name: 'Efficient Step',
        estimatedDuration: 15,
        responsibleRole: 'Team',
        painPoints: [],
      }),
    ]);

    const analysis = analyzeProcess(process);

    expect(analysis.overallScore).toBeGreaterThanOrEqual(80);
    expect(analysis.wastes).toHaveLength(0);
  });
});
