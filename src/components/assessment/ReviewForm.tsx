'use client';

import type { ProcessOverviewData } from './ProcessOverviewForm';
import type { StepData } from './StepCard';
import { Card, CardTitle, Badge } from '@/components/ui';

type ReviewFormProps = {
  overview: ProcessOverviewData;
  steps: StepData[];
  onEditSection: (section: 'overview' | 'steps') => void;
};

export function ReviewForm({ overview, steps, onEditSection }: ReviewFormProps) {
  const frequencyLabels: Record<string, string> = {
    multiple_daily: 'Multiple times daily',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    ad_hoc: 'Ad-hoc',
  };

  const totalDuration = steps.reduce((sum, step) => sum + (step.estimatedDuration || 0), 0);
  const stepsWithPainPoints = steps.filter((s) => s.painPoints.trim()).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Review Your Process
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review the information you&apos;ve provided before generating your analysis.
        </p>
      </div>

      {/* Process Overview */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <CardTitle>Process Overview</CardTitle>
          <button
            onClick={() => onEditSection('overview')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Edit
          </button>
        </div>

        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
            <dd className="text-gray-900 dark:text-white">{overview.name || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Purpose</dt>
            <dd className="text-gray-900 dark:text-white">{overview.purpose || '—'}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Trigger</dt>
              <dd className="text-gray-900 dark:text-white">{overview.trigger || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Frequency</dt>
              <dd className="text-gray-900 dark:text-white">
                {overview.frequency ? frequencyLabels[overview.frequency] : '—'}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Stakeholders</dt>
            <dd className="text-gray-900 dark:text-white">{overview.stakeholders || '—'}</dd>
          </div>
        </dl>
      </Card>

      {/* Process Steps Summary */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <CardTitle>Process Steps ({steps.length})</CardTitle>
          <button
            onClick={() => onEditSection('steps')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Edit
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{steps.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Steps</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalDuration}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Minutes</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stepsWithPainPoints}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">With Pain Points</div>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {step.name || `Step ${index + 1}`}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {step.responsibleRole || 'No role assigned'} • {step.estimatedDuration || 0} min
                </div>
              </div>
              {step.painPoints.trim() && <Badge variant="warning">Has Issues</Badge>}
            </div>
          ))}
        </div>
      </Card>

      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <p className="text-sm text-primary-800 dark:text-primary-200">
          <strong>Ready to analyze!</strong> Click &quot;Generate Analysis&quot; to receive your
          Lean Six Sigma process breakdown, waste identification, and optimization recommendations.
        </p>
      </div>
    </div>
  );
}
