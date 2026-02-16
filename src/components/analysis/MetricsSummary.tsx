import type { ProcessMetrics } from '@/types/analysis';
import { Card, CardTitle, ProgressBar } from '@/components/ui';

type MetricsSummaryProps = {
  metrics: ProcessMetrics;
  className?: string;
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function MetricsSummary({ metrics, className = '' }: MetricsSummaryProps) {
  return (
    <Card className={className}>
      <CardTitle className="mb-4">Process Metrics</CardTitle>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatDuration(metrics.leadTime)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Lead Time</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatDuration(metrics.cycleTime)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Cycle Time</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.touchPoints}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Touch Points</div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Process Efficiency</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {metrics.processEfficiency}%
            </span>
          </div>
          <ProgressBar
            value={metrics.processEfficiency}
            color={
              metrics.processEfficiency >= 70
                ? 'success'
                : metrics.processEfficiency >= 50
                  ? 'warning'
                  : 'error'
            }
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">First Pass Yield</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {metrics.firstPassYield}%
            </span>
          </div>
          <ProgressBar
            value={metrics.firstPassYield}
            color={
              metrics.firstPassYield >= 90
                ? 'success'
                : metrics.firstPassYield >= 70
                  ? 'warning'
                  : 'error'
            }
          />
        </div>
      </div>
    </Card>
  );
}
