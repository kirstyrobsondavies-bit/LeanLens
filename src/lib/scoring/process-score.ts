import type { ProcessMetrics, Severity, WasteInstance } from '@/types/analysis';

const WASTE_PENALTIES: Record<Severity, number> = {
  high: 15,
  medium: 8,
  low: 3,
};

export function calculateMetricsScore(metrics: ProcessMetrics): number {
  // Weight: efficiency (40%), first pass yield (30%), touch points penalty (30%)
  const efficiencyScore = metrics.processEfficiency;
  const yieldScore = metrics.firstPassYield;

  // Touch points penalty: more touch points = lower score
  // Assume ideal is 2-3, penalize above that
  const idealTouchPoints = 3;
  const touchPointsPenalty = Math.max(0, (metrics.touchPoints - idealTouchPoints) * 10);
  const touchPointsScore = Math.max(0, 100 - touchPointsPenalty);

  return Math.round(efficiencyScore * 0.4 + yieldScore * 0.3 + touchPointsScore * 0.3);
}

export function calculateWasteScore(wastes: WasteInstance[]): number {
  const totalPenalty = wastes.reduce((sum, waste) => sum + WASTE_PENALTIES[waste.severity], 0);
  return Math.max(0, 100 - totalPenalty);
}

export function calculateProcessScore(metrics: ProcessMetrics, wastes: WasteInstance[]): number {
  const metricsScore = calculateMetricsScore(metrics);
  const wasteScore = calculateWasteScore(wastes);

  // Overall: 40% metrics, 60% waste (waste has more impact on score)
  const score = Math.round(metricsScore * 0.4 + wasteScore * 0.6);

  return Math.max(0, Math.min(100, score));
}
