import type { AutomationOpportunity } from '@/types/analysis';
import type { ProcessStep, StepId } from '@/types/process';
import { Card, CardTitle, Button, SeverityBadge } from '@/components/ui';

type AutomationTeaserProps = {
  opportunities: AutomationOpportunity[];
  steps: ProcessStep[];
  className?: string;
};

function getStepName(stepId: StepId, steps: ProcessStep[]): string {
  const step = steps.find((s) => s.id === stepId);
  return step?.name || 'Unknown step';
}

export function AutomationTeaser({ opportunities, steps, className = '' }: AutomationTeaserProps) {
  const highROI = opportunities.filter((o) => o.roiPotential === 'high');
  const totalOpportunities = opportunities.length;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardTitle className="mb-4">Automation Opportunities</CardTitle>

      {/* Summary stats */}
      <div className="flex gap-4 mb-6">
        <div className="text-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex-1">
          <div className="text-2xl font-bold text-primary-600">{totalOpportunities}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Opportunities</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex-1">
          <div className="text-2xl font-bold text-green-600">{highROI.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">High ROI</div>
        </div>
      </div>

      {/* Preview of top opportunities */}
      <div className="space-y-2 mb-6">
        {opportunities.slice(0, 3).map((opp, index) => (
          <div
            key={`${opp.stepId}-${index}`}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {getStepName(opp.stepId, steps)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Suggested: {opp.suggestedTools.slice(0, 2).join(', ')}
              </div>
            </div>
            <SeverityBadge severity={opp.roiPotential} />
          </div>
        ))}
      </div>

      {/* Blurred preview */}
      {opportunities.length > 3 && (
        <div className="relative">
          <div className="space-y-2 blur-sm">
            {opportunities.slice(3, 5).map((opp, index) => (
              <div
                key={`blur-${opp.stepId}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {getStepName(opp.stepId, steps)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Suggested: {opp.suggestedTools.slice(0, 2).join(', ')}
                  </div>
                </div>
                <SeverityBadge severity={opp.roiPotential} />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
        </div>
      )}

      {/* CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Get Your Full Automation Plan
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Receive a detailed automation roadmap with step-by-step implementation guides, tool
          recommendations, and ROI projections tailored to your process.
        </p>
        <Button className="w-full">Unlock Full Plan - $49</Button>
      </div>
    </Card>
  );
}
