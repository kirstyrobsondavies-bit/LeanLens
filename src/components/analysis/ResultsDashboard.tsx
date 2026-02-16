'use client';

import type { Process } from '@/types/process';
import type { ProcessAnalysis } from '@/types/analysis';
import { Card, CardTitle, Button } from '@/components/ui';
import { ScoreDisplay } from './ScoreDisplay';
import { MetricsSummary } from './MetricsSummary';
import { WasteTable } from './WasteTable';
import { RecommendationsList } from './RecommendationsList';
import { AutomationTeaser } from './AutomationTeaser';
import Link from 'next/link';

type ResultsDashboardProps = {
  process: Process;
  analysis: ProcessAnalysis;
};

export function ResultsDashboard({ process, analysis }: ResultsDashboardProps) {
  const { metrics, wastes, bottlenecks, automationOpportunities, overallScore, recommendations } =
    analysis;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span>/</span>
          <span>Analysis Results</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{process.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{process.purpose}</p>
      </div>

      {/* Score and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-6">
          <CardTitle className="mb-4 text-center">Overall Score</CardTitle>
          <ScoreDisplay score={overallScore} size="lg" />
        </Card>

        <div className="md:col-span-2">
          <MetricsSummary metrics={metrics} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Waste Analysis */}
        <WasteTable wastes={wastes} steps={process.steps} />

        {/* Recommendations */}
        <RecommendationsList recommendations={recommendations} />
      </div>

      {/* Bottlenecks */}
      {bottlenecks.length > 0 && (
        <Card className="mb-8">
          <CardTitle className="mb-4">Identified Bottlenecks</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bottlenecks.map((bottleneckId) => {
              const step = process.steps.find((s) => s.id === bottleneckId);
              if (!step) return null;
              return (
                <div
                  key={bottleneckId}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="font-medium text-red-800 dark:text-red-200">{step.name}</div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {step.estimatedDuration} min • {step.responsibleRole}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Automation Teaser */}
      <AutomationTeaser opportunities={automationOpportunities} steps={process.steps} />

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/assessment">
          <Button variant="outline">Analyze Another Process</Button>
        </Link>
        <Button onClick={() => window.print()}>Download Report (PDF)</Button>
      </div>
    </div>
  );
}
