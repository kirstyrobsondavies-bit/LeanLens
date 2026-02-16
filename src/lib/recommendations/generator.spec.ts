import { describe, expect, test } from 'vitest';
import type { Process, ProcessStep, StepId, ProcessId } from '@/types/process';
import type { AutomationOpportunity, ProcessMetrics, WasteInstance } from '@/types/analysis';
import { generateRecommendations } from './generator';

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

function createMockMetrics(overrides: Partial<ProcessMetrics> = {}): ProcessMetrics {
  return {
    leadTime: 100,
    cycleTime: 80,
    processEfficiency: 80,
    firstPassYield: 90,
    touchPoints: 3,
    ...overrides,
  };
}

function createMockWaste(overrides: Partial<WasteInstance> = {}): WasteInstance {
  return {
    type: 'defects',
    stepId: 'step-1' as StepId,
    description: 'Test waste',
    severity: 'high',
    estimatedImpact: 'Test impact',
    ...overrides,
  };
}

function createMockAutomationOpp(
  overrides: Partial<AutomationOpportunity> = {}
): AutomationOpportunity {
  return {
    stepId: 'step-1' as StepId,
    potential: 'high',
    complexity: 'low',
    roiPotential: 'high',
    suggestedTools: ['n8n', 'Zapier'],
    description: 'Test opportunity',
    ...overrides,
  };
}

describe('generateRecommendations', () => {
  const baseStep = createMockStep({ id: 'step-1' as StepId, name: 'Data Entry' });
  const baseProcess = createMockProcess([baseStep]);

  test('generates recommendations for wastes', () => {
    const wastes = [createMockWaste({ type: 'defects', description: 'frequent errors' })];
    const recommendations = generateRecommendations(
      baseProcess,
      createMockMetrics(),
      wastes,
      [],
      []
    );

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.some((r) => r.includes('error') || r.includes('Data Entry'))).toBe(true);
  });

  test('generates recommendations for bottlenecks', () => {
    const bottlenecks: StepId[] = ['step-1' as StepId];
    const step = createMockStep({
      id: 'step-1' as StepId,
      name: 'Slow Step',
      estimatedDuration: 90,
    });
    const process = createMockProcess([step]);

    const recommendations = generateRecommendations(
      process,
      createMockMetrics(),
      [],
      bottlenecks,
      []
    );

    expect(recommendations.some((r) => r.includes('Slow Step'))).toBe(true);
  });

  test('generates recommendations for automation opportunities', () => {
    const opportunities = [createMockAutomationOpp({ suggestedTools: ['n8n', 'Make'] })];
    const recommendations = generateRecommendations(
      baseProcess,
      createMockMetrics(),
      [],
      [],
      opportunities
    );

    expect(recommendations.some((r) => r.includes('Automate') || r.includes('n8n'))).toBe(true);
  });

  test('generates recommendations for poor metrics', () => {
    const metrics = createMockMetrics({
      processEfficiency: 30,
      firstPassYield: 60,
      touchPoints: 8,
    });
    const recommendations = generateRecommendations(baseProcess, metrics, [], [], []);

    expect(recommendations.some((r) => r.includes('efficiency') || r.includes('30%'))).toBe(true);
    expect(recommendations.some((r) => r.includes('yield') || r.includes('60%'))).toBe(true);
    expect(recommendations.some((r) => r.includes('touch points') || r.includes('8'))).toBe(true);
  });

  test('prioritizes high severity wastes', () => {
    const wastes = [
      createMockWaste({ type: 'skills', severity: 'low', stepId: 'step-1' as StepId }),
      createMockWaste({ type: 'defects', severity: 'high', stepId: 'step-1' as StepId }),
    ];
    const recommendations = generateRecommendations(
      baseProcess,
      createMockMetrics(),
      wastes,
      [],
      []
    );

    // Defects (high severity) should come before skills (low severity)
    const defectsIndex = recommendations.findIndex((r) => r.toLowerCase().includes('error'));
    const skillsIndex = recommendations.findIndex((r) => r.toLowerCase().includes('skill'));

    if (defectsIndex !== -1 && skillsIndex !== -1) {
      expect(defectsIndex).toBeLessThan(skillsIndex);
    }
  });

  test('removes duplicate recommendations', () => {
    const wastes = [
      createMockWaste({ type: 'defects', description: 'errors in data' }),
      createMockWaste({ type: 'defects', description: 'errors in data' }),
    ];
    const recommendations = generateRecommendations(
      baseProcess,
      createMockMetrics(),
      wastes,
      [],
      []
    );

    const uniqueRecommendations = new Set(recommendations.map((r) => r.toLowerCase()));
    expect(recommendations.length).toBe(uniqueRecommendations.size);
  });

  test('limits number of recommendations per category', () => {
    const wastes = Array.from({ length: 10 }, (_, i) =>
      createMockWaste({
        type: 'defects',
        description: `error ${i}`,
        stepId: `step-${i}` as StepId,
      })
    );
    const steps = Array.from({ length: 10 }, (_, i) =>
      createMockStep({ id: `step-${i}` as StepId, name: `Step ${i}` })
    );
    const process = createMockProcess(steps);

    const recommendations = generateRecommendations(process, createMockMetrics(), wastes, [], []);

    // Should be limited, not 10+ waste recommendations
    expect(recommendations.length).toBeLessThanOrEqual(15);
  });

  test('handles empty inputs gracefully', () => {
    const metrics = createMockMetrics({
      processEfficiency: 90,
      firstPassYield: 95,
      touchPoints: 2,
    });
    const recommendations = generateRecommendations(baseProcess, metrics, [], [], []);

    // Should return empty or minimal recommendations for good process
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  test('generates waste-type specific recommendations', () => {
    const wastes = [
      createMockWaste({ type: 'waiting', description: 'waiting for approval' }),
      createMockWaste({ type: 'transportation', description: 'moving files between systems' }),
    ];
    const recommendations = generateRecommendations(
      baseProcess,
      createMockMetrics(),
      wastes,
      [],
      []
    );

    expect(recommendations.some((r) => r.includes('wait') || r.includes('parallel'))).toBe(true);
    expect(
      recommendations.some(
        (r) => r.includes('movement') || r.includes('consolidat') || r.includes('integrat')
      )
    ).toBe(true);
  });
});
