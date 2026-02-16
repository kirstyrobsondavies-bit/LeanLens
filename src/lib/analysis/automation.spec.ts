import { describe, expect, test } from 'vitest';
import type { ProcessStep, StepId } from '@/types/process';
import {
  analyzeAutomationOpportunities,
  assessAutomationComplexity,
  assessAutomationPotential,
  suggestAutomationTools,
} from './automation';

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

describe('assessAutomationPotential', () => {
  test('returns high for manual tasks', () => {
    const step = createMockStep({ painPoints: ['lots of manual data entry'] });
    expect(assessAutomationPotential(step)).toBe('high');
  });

  test('returns high for repetitive tasks', () => {
    const step = createMockStep({ painPoints: ['repetitive copying between systems'] });
    expect(assessAutomationPotential(step)).toBe('high');
  });

  test('returns high for spreadsheet work', () => {
    const step = createMockStep({ tools: ['Excel', 'Google Sheets'] });
    expect(assessAutomationPotential(step)).toBe('high');
  });

  test('returns medium for slow tasks', () => {
    const step = createMockStep({ painPoints: ['this step is slow'] });
    expect(assessAutomationPotential(step)).toBe('medium');
  });

  test('returns medium for long duration tasks', () => {
    const step = createMockStep({ estimatedDuration: 45 });
    expect(assessAutomationPotential(step)).toBe('medium');
  });

  test('returns low for already efficient tasks', () => {
    const step = createMockStep({ estimatedDuration: 10, painPoints: [] });
    expect(assessAutomationPotential(step)).toBe('low');
  });
});

describe('assessAutomationComplexity', () => {
  test('returns high for decision-requiring tasks', () => {
    const step = createMockStep({ description: 'Make decision based on context' });
    expect(assessAutomationComplexity(step)).toBe('high');
  });

  test('returns high for tasks requiring judgment', () => {
    const step = createMockStep({ painPoints: ['requires judgment call'] });
    expect(assessAutomationComplexity(step)).toBe('high');
  });

  test('returns high for tasks with many tools', () => {
    const step = createMockStep({ tools: ['Tool1', 'Tool2', 'Tool3', 'Tool4'] });
    expect(assessAutomationComplexity(step)).toBe('high');
  });

  test('returns medium for conditional tasks', () => {
    const step = createMockStep({ description: 'Process conditionally based on input' });
    expect(assessAutomationComplexity(step)).toBe('medium');
  });

  test('returns medium for tasks with multiple systems', () => {
    const step = createMockStep({ tools: ['System A', 'System B'] });
    expect(assessAutomationComplexity(step)).toBe('medium');
  });

  test('returns low for simple tasks', () => {
    const step = createMockStep({ description: 'Simple data transfer' });
    expect(assessAutomationComplexity(step)).toBe('low');
  });
});

describe('suggestAutomationTools', () => {
  test('suggests workflow tools for spreadsheet tasks', () => {
    const step = createMockStep({ tools: ['Excel'] });
    const tools = suggestAutomationTools(step);
    expect(tools).toContain('n8n');
    expect(tools).toContain('Zapier');
  });

  test('suggests email tools for email tasks', () => {
    const step = createMockStep({ painPoints: ['lots of email back and forth'] });
    const tools = suggestAutomationTools(step);
    expect(tools.some((t) => ['n8n', 'Zapier', 'SendGrid', 'Mailchimp'].includes(t))).toBe(true);
  });

  test('suggests CRM tools for CRM-related tasks', () => {
    const step = createMockStep({ tools: ['CRM system'] });
    const tools = suggestAutomationTools(step);
    expect(tools.some((t) => ['GoHighLevel', 'HubSpot', 'Salesforce'].includes(t))).toBe(true);
  });

  test('suggests document tools for document tasks', () => {
    const step = createMockStep({ description: 'Send document for signature' });
    const tools = suggestAutomationTools(step);
    expect(tools.some((t) => ['DocuSign', 'PandaDoc', 'Adobe Sign'].includes(t))).toBe(true);
  });

  test('suggests default tools when no specific match', () => {
    const step = createMockStep({ name: 'Generic step', tools: [] });
    const tools = suggestAutomationTools(step);
    expect(tools).toContain('n8n');
    expect(tools).toContain('Make');
    expect(tools).toContain('Zapier');
  });
});

describe('analyzeAutomationOpportunities', () => {
  test('returns opportunities for all steps', () => {
    const steps = [
      createMockStep({ id: 'step-1' as StepId }),
      createMockStep({ id: 'step-2' as StepId }),
    ];
    const opportunities = analyzeAutomationOpportunities(steps);
    expect(opportunities).toHaveLength(2);
  });

  test('opportunity includes all required fields', () => {
    const steps = [createMockStep({ painPoints: ['manual work'] })];
    const opportunities = analyzeAutomationOpportunities(steps);

    expect(opportunities[0]).toHaveProperty('stepId');
    expect(opportunities[0]).toHaveProperty('potential');
    expect(opportunities[0]).toHaveProperty('complexity');
    expect(opportunities[0]).toHaveProperty('roiPotential');
    expect(opportunities[0]).toHaveProperty('suggestedTools');
    expect(opportunities[0]).toHaveProperty('description');
  });

  test('calculates high ROI for high potential + low complexity', () => {
    const steps = [
      createMockStep({
        painPoints: ['manual data entry'], // high potential
        description: 'Simple task', // low complexity
        tools: [],
      }),
    ];
    const opportunities = analyzeAutomationOpportunities(steps);
    expect(opportunities[0].roiPotential).toBe('high');
  });

  test('calculates low ROI for low potential + high complexity', () => {
    const steps = [
      createMockStep({
        estimatedDuration: 5, // low potential
        painPoints: ['requires complex judgment'], // high complexity
        tools: ['A', 'B', 'C', 'D'],
      }),
    ];
    const opportunities = analyzeAutomationOpportunities(steps);
    expect(opportunities[0].roiPotential).toBe('low');
  });

  test('generates appropriate descriptions', () => {
    const steps = [createMockStep({ name: 'Data Entry', painPoints: ['manual entry'] })];
    const opportunities = analyzeAutomationOpportunities(steps);
    expect(opportunities[0].description).toContain('Data Entry');
    expect(opportunities[0].description).toContain('high automation potential');
  });
});
