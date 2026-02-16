import type { ProcessStep } from '@/types/process';
import type { AutomationOpportunity, Severity } from '@/types/analysis';

const HIGH_POTENTIAL_KEYWORDS = [
  'manual',
  'repetitive',
  'copy paste',
  'data entry',
  'spreadsheet',
  'excel',
];
const MEDIUM_POTENTIAL_KEYWORDS = ['slow', 'tedious', 'time-consuming', 'routine'];
const AUTOMATION_TOOLS: Record<string, string[]> = {
  spreadsheet: ['n8n', 'Make', 'Zapier', 'Power Automate'],
  excel: ['n8n', 'Make', 'Zapier', 'Power Automate'],
  email: ['n8n', 'Zapier', 'SendGrid', 'Mailchimp'],
  crm: ['GoHighLevel', 'HubSpot', 'Salesforce'],
  'data entry': ['n8n', 'UiPath', 'Automation Anywhere'],
  document: ['DocuSign', 'PandaDoc', 'Adobe Sign'],
  scheduling: ['Calendly', 'Acuity', 'GoHighLevel'],
  default: ['n8n', 'Make', 'Zapier'],
};

function containsAnyKeyword(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
}

export function assessAutomationPotential(step: ProcessStep): Severity {
  const allText = [step.name, step.description, ...step.painPoints, ...step.tools].join(' ');

  if (containsAnyKeyword(allText, HIGH_POTENTIAL_KEYWORDS)) {
    return 'high';
  }

  if (containsAnyKeyword(allText, MEDIUM_POTENTIAL_KEYWORDS)) {
    return 'medium';
  }

  // Duration-based assessment: longer manual steps have more automation potential
  if (step.estimatedDuration > 30) {
    return 'medium';
  }

  return 'low';
}

export function assessAutomationComplexity(step: ProcessStep): Severity {
  // Complexity factors
  const complexityIndicators = {
    high: ['decision', 'judgment', 'complex', 'custom', 'exception', 'approval required'],
    medium: ['conditional', 'variable', 'multiple systems', 'integration'],
    low: ['simple', 'standard', 'straightforward', 'single step'],
  };

  const allText = [step.name, step.description, ...step.painPoints].join(' ');

  if (containsAnyKeyword(allText, complexityIndicators.high)) {
    return 'high';
  }

  if (containsAnyKeyword(allText, complexityIndicators.medium)) {
    return 'medium';
  }

  // More tools = more complex integration
  if (step.tools.length > 3) {
    return 'high';
  }

  if (step.tools.length > 1) {
    return 'medium';
  }

  return 'low';
}

export function suggestAutomationTools(step: ProcessStep): string[] {
  const allText = [step.name, step.description, ...step.painPoints, ...step.tools]
    .join(' ')
    .toLowerCase();

  const suggestedTools = new Set<string>();

  for (const [keyword, tools] of Object.entries(AUTOMATION_TOOLS)) {
    if (keyword !== 'default' && allText.includes(keyword)) {
      for (const tool of tools) {
        suggestedTools.add(tool);
      }
    }
  }

  // If no specific tools matched, suggest defaults
  if (suggestedTools.size === 0) {
    for (const tool of AUTOMATION_TOOLS.default) {
      suggestedTools.add(tool);
    }
  }

  return Array.from(suggestedTools);
}

function calculateROIPotential(
  step: ProcessStep,
  potential: Severity,
  complexity: Severity
): Severity {
  // High ROI = high potential + low complexity
  // Low ROI = low potential OR high complexity

  if (potential === 'high' && complexity === 'low') return 'high';
  if (potential === 'high' && complexity === 'medium') return 'high';
  if (potential === 'medium' && complexity === 'low') return 'high';
  if (potential === 'medium' && complexity === 'medium') return 'medium';
  if (potential === 'high' && complexity === 'high') return 'medium';
  if (potential === 'low' && complexity === 'low') return 'medium';

  return 'low';
}

function generateOpportunityDescription(step: ProcessStep, potential: Severity): string {
  const templates: Record<Severity, string> = {
    high: `"${step.name}" has high automation potential due to manual, repetitive tasks that can be streamlined.`,
    medium: `"${step.name}" could benefit from partial automation to reduce time and effort.`,
    low: `"${step.name}" has limited automation potential but may benefit from process improvements.`,
  };

  return templates[potential];
}

export function analyzeAutomationOpportunities(steps: ProcessStep[]): AutomationOpportunity[] {
  return steps.map((step) => {
    const potential = assessAutomationPotential(step);
    const complexity = assessAutomationComplexity(step);
    const roiPotential = calculateROIPotential(step, potential, complexity);

    return {
      stepId: step.id,
      potential,
      complexity,
      roiPotential,
      suggestedTools: suggestAutomationTools(step),
      description: generateOpportunityDescription(step, potential),
    };
  });
}
