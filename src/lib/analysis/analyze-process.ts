import type { Process } from '@/types/process';
import type { ProcessAnalysis } from '@/types/analysis';
import { calculateMetrics } from './metrics';
import { detectWastes } from './waste-detector';
import { identifyBottlenecks } from './bottleneck';
import { analyzeAutomationOpportunities } from './automation';
import { calculateProcessScore } from '../scoring/process-score';
import { generateRecommendations } from '../recommendations/generator';

export function analyzeProcess(process: Process): ProcessAnalysis {
  // Calculate all analysis components
  const metrics = calculateMetrics(process);
  const wastes = detectWastes(process);
  const bottlenecks = identifyBottlenecks(process);
  const automationOpportunities = analyzeAutomationOpportunities(process.steps);

  // Calculate overall score
  const overallScore = calculateProcessScore(metrics, wastes);

  // Generate recommendations
  const recommendations = generateRecommendations(
    process,
    metrics,
    wastes,
    bottlenecks,
    automationOpportunities
  );

  return {
    processId: process.id,
    metrics,
    wastes,
    bottlenecks,
    automationOpportunities,
    overallScore,
    recommendations,
  };
}
