import { describe, expect, test } from 'vitest';
import fc from 'fast-check';
import type { ProcessMetrics, WasteInstance } from '@/types/analysis';
import type { StepId } from '@/types/process';
import { calculateMetricsScore, calculateProcessScore, calculateWasteScore } from './process-score';

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

function createMockWaste(severity: 'low' | 'medium' | 'high'): WasteInstance {
  return {
    type: 'defects',
    stepId: 'step-1' as StepId,
    description: 'Test waste',
    severity,
    estimatedImpact: 'Test impact',
  };
}

describe('calculateMetricsScore', () => {
  test('returns high score for efficient process', () => {
    const metrics = createMockMetrics({
      processEfficiency: 95,
      firstPassYield: 95,
      touchPoints: 2,
    });
    const score = calculateMetricsScore(metrics);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  test('returns low score for inefficient process', () => {
    const metrics = createMockMetrics({
      processEfficiency: 20,
      firstPassYield: 50,
      touchPoints: 10,
    });
    const score = calculateMetricsScore(metrics);
    expect(score).toBeLessThan(50);
  });

  test('penalizes high touch points', () => {
    const lowTouchPoints = calculateMetricsScore(createMockMetrics({ touchPoints: 2 }));
    const highTouchPoints = calculateMetricsScore(createMockMetrics({ touchPoints: 10 }));
    expect(lowTouchPoints).toBeGreaterThan(highTouchPoints);
  });
});

describe('calculateWasteScore', () => {
  test('returns 100 for no wastes', () => {
    expect(calculateWasteScore([])).toBe(100);
  });

  test('applies correct penalty for high severity waste', () => {
    const wastes = [createMockWaste('high')];
    expect(calculateWasteScore(wastes)).toBe(85); // 100 - 15
  });

  test('applies correct penalty for medium severity waste', () => {
    const wastes = [createMockWaste('medium')];
    expect(calculateWasteScore(wastes)).toBe(92); // 100 - 8
  });

  test('applies correct penalty for low severity waste', () => {
    const wastes = [createMockWaste('low')];
    expect(calculateWasteScore(wastes)).toBe(97); // 100 - 3
  });

  test('accumulates penalties for multiple wastes', () => {
    const wastes = [createMockWaste('high'), createMockWaste('medium'), createMockWaste('low')];
    expect(calculateWasteScore(wastes)).toBe(74); // 100 - 15 - 8 - 3
  });

  test('never returns below 0', () => {
    const wastes = Array.from({ length: 20 }, () => createMockWaste('high'));
    expect(calculateWasteScore(wastes)).toBe(0);
  });
});

describe('calculateProcessScore', () => {
  test('returns high score for perfect process', () => {
    const metrics = createMockMetrics({
      processEfficiency: 100,
      firstPassYield: 100,
      touchPoints: 2,
    });
    const score = calculateProcessScore(metrics, []);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  test('returns low score for poor process with many wastes', () => {
    const metrics = createMockMetrics({
      processEfficiency: 30,
      firstPassYield: 50,
      touchPoints: 8,
    });
    const wastes = [
      createMockWaste('high'),
      createMockWaste('high'),
      createMockWaste('medium'),
      createMockWaste('medium'),
    ];
    const score = calculateProcessScore(metrics, wastes);
    expect(score).toBeLessThan(50);
  });

  test('score is always between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 20 }),
        fc.array(
          fc.constantFrom('low', 'medium', 'high') as fc.Arbitrary<'low' | 'medium' | 'high'>,
          {
            maxLength: 15,
          }
        ),
        (efficiency, yield_, touchPoints, wasteSeverities) => {
          const metrics = createMockMetrics({
            processEfficiency: efficiency,
            firstPassYield: yield_,
            touchPoints,
          });
          const wastes = wasteSeverities.map((s) => createMockWaste(s));
          const score = calculateProcessScore(metrics, wastes);
          return score >= 0 && score <= 100;
        }
      )
    );
  });

  test('more wastes never increase score', () => {
    const metrics = createMockMetrics();
    const baseScore = calculateProcessScore(metrics, []);
    const scoreWithWaste = calculateProcessScore(metrics, [createMockWaste('low')]);
    expect(scoreWithWaste).toBeLessThanOrEqual(baseScore);
  });
});
