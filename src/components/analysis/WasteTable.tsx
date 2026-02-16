import type { ProcessStep, StepId } from '@/types/process';
import type { WasteInstance, WasteType } from '@/types/analysis';
import { Card, CardTitle, SeverityBadge } from '@/components/ui';

type WasteTableProps = {
  wastes: WasteInstance[];
  steps: ProcessStep[];
  className?: string;
};

const wasteLabels: Record<WasteType, string> = {
  transportation: 'Transportation',
  inventory: 'Inventory',
  motion: 'Motion',
  waiting: 'Waiting',
  overproduction: 'Overproduction',
  overprocessing: 'Overprocessing',
  defects: 'Defects',
  skills: 'Skills (Underutilized)',
};

const wasteDescriptions: Record<WasteType, string> = {
  transportation: 'Unnecessary movement of data or materials',
  inventory: 'Work piling up between steps',
  motion: 'Unnecessary movement of people (searching, navigating)',
  waiting: 'Idle time waiting for inputs or approvals',
  overproduction: 'Creating more than needed',
  overprocessing: 'Doing more work than required',
  defects: 'Errors requiring rework',
  skills: 'Human potential wasted on automatable tasks',
};

function getStepName(stepId: StepId, steps: ProcessStep[]): string {
  const step = steps.find((s) => s.id === stepId);
  return step?.name || 'Unknown step';
}

export function WasteTable({ wastes, steps, className = '' }: WasteTableProps) {
  // Group wastes by type
  const groupedWastes = wastes.reduce(
    (acc, waste) => {
      if (!acc[waste.type]) {
        acc[waste.type] = [];
      }
      acc[waste.type].push(waste);
      return acc;
    },
    {} as Record<WasteType, WasteInstance[]>
  );

  if (wastes.length === 0) {
    return (
      <Card className={className}>
        <CardTitle className="mb-4">TIMWOODS Waste Analysis</CardTitle>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No significant waste detected in your process!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardTitle className="mb-4">TIMWOODS Waste Analysis</CardTitle>

      <div className="space-y-4">
        {(Object.keys(groupedWastes) as WasteType[]).map((wasteType) => (
          <div
            key={wasteType}
            className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {wasteLabels[wasteType]}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({groupedWastes[wasteType].length})
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {wasteDescriptions[wasteType]}
            </p>

            <div className="space-y-2">
              {groupedWastes[wasteType].map((waste, index) => (
                <div
                  key={`${waste.stepId}-${index}`}
                  className="flex items-start gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <SeverityBadge severity={waste.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getStepName(waste.stepId, steps)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{waste.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
