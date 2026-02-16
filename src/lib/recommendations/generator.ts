import type { Process, ProcessStep, StepId } from '@/types/process';
import type { AutomationOpportunity, ProcessMetrics, WasteInstance } from '@/types/analysis';

function getStepName(stepId: StepId, steps: ProcessStep[]): string {
  const step = steps.find((s) => s.id === stepId);
  return step?.name || 'Unknown step';
}

function generateWasteRecommendations(wastes: WasteInstance[], steps: ProcessStep[]): string[] {
  const recommendations: string[] = [];

  const wasteTemplates: Record<string, (waste: WasteInstance, stepName: string) => string> = {
    transportation: (w, name) =>
      `Reduce data movement in "${name}": ${w.description}. Consider consolidating systems or creating direct integrations.`,
    inventory: (w, name) =>
      `Address work backlog in "${name}": ${w.description}. Implement flow-based processing to reduce batch sizes.`,
    motion: (w, name) =>
      `Eliminate unnecessary searching in "${name}": ${w.description}. Organize information and create clear navigation paths.`,
    waiting: (w, name) =>
      `Reduce wait times in "${name}": ${w.description}. Consider parallel processing or automated approvals.`,
    overproduction: (w, name) =>
      `Eliminate overproduction in "${name}": ${w.description}. Produce only what is needed, when it is needed.`,
    overprocessing: (w, name) =>
      `Simplify processing in "${name}": ${w.description}. Review approval chains and remove unnecessary steps.`,
    defects: (w, name) =>
      `Reduce errors in "${name}": ${w.description}. Implement validation checks and error-proofing mechanisms.`,
    skills: (w, name) =>
      `Better utilize skills in "${name}": ${w.description}. Automate routine tasks to free up human potential.`,
  };

  // Prioritize high severity wastes first
  const sortedWastes = [...wastes].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  for (const waste of sortedWastes.slice(0, 5)) {
    const template = wasteTemplates[waste.type];
    if (template) {
      const stepName = getStepName(waste.stepId, steps);
      recommendations.push(template(waste, stepName));
    }
  }

  return recommendations;
}

function generateBottleneckRecommendations(bottlenecks: StepId[], steps: ProcessStep[]): string[] {
  const recommendations: string[] = [];

  for (const bottleneckId of bottlenecks.slice(0, 3)) {
    const step = steps.find((s) => s.id === bottleneckId);
    if (step) {
      if (step.estimatedDuration > 60) {
        recommendations.push(
          `"${step.name}" takes ${step.estimatedDuration} minutes. Consider breaking it into smaller parallel tasks or automating portions.`
        );
      } else {
        recommendations.push(
          `"${step.name}" is a bottleneck. Review resource allocation and consider cross-training to reduce dependency.`
        );
      }
    }
  }

  return recommendations;
}

function generateAutomationRecommendations(
  opportunities: AutomationOpportunity[],
  steps: ProcessStep[]
): string[] {
  const recommendations: string[] = [];

  // Filter to high ROI opportunities
  const highROI = opportunities.filter((o) => o.roiPotential === 'high');

  for (const opp of highROI.slice(0, 3)) {
    const stepName = getStepName(opp.stepId, steps);
    const tools = opp.suggestedTools.slice(0, 3).join(', ');
    recommendations.push(
      `Automate "${stepName}" using ${tools}. This step has high automation potential with low complexity.`
    );
  }

  return recommendations;
}

function generateMetricsRecommendations(metrics: ProcessMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.processEfficiency < 50) {
    recommendations.push(
      `Process efficiency is ${metrics.processEfficiency}%. Target 70%+ by reducing non-value-add activities and wait times.`
    );
  }

  if (metrics.firstPassYield < 80) {
    recommendations.push(
      `First pass yield is ${metrics.firstPassYield}%. Implement quality checks and validation to reduce rework.`
    );
  }

  if (metrics.touchPoints > 5) {
    recommendations.push(
      `${metrics.touchPoints} touch points detected. Reduce handoffs by consolidating responsibilities or automating transitions.`
    );
  }

  return recommendations;
}

export function generateRecommendations(
  process: Process,
  metrics: ProcessMetrics,
  wastes: WasteInstance[],
  bottlenecks: StepId[],
  automationOpportunities: AutomationOpportunity[]
): string[] {
  const allRecommendations: string[] = [];

  // Add recommendations in priority order
  allRecommendations.push(...generateWasteRecommendations(wastes, process.steps));
  allRecommendations.push(...generateBottleneckRecommendations(bottlenecks, process.steps));
  allRecommendations.push(
    ...generateAutomationRecommendations(automationOpportunities, process.steps)
  );
  allRecommendations.push(...generateMetricsRecommendations(metrics));

  // Remove duplicates while preserving order
  const seen = new Set<string>();
  return allRecommendations.filter((rec) => {
    const normalized = rec.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
