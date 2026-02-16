'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Process, ProcessFrequency, AssessmentId } from '@/types/process';
import { Button, WizardProgress } from '@/components/ui';
import { ProcessOverviewForm } from './ProcessOverviewForm';
import type { ProcessOverviewData } from './ProcessOverviewForm';
import { ProcessStepsForm, createEmptyStep } from './ProcessStepsForm';
import type { StepData } from './StepCard';
import { ReviewForm } from './ReviewForm';
import { createProcessId, createAssessmentId } from '@/lib/id';
import { saveProcess, saveAssessment } from '@/lib/storage/assessment-storage';
import { analyzeProcess } from '@/lib/analysis/analyze-process';
import { saveAnalysis } from '@/lib/storage/assessment-storage';

type WizardStep = 'overview' | 'steps' | 'review';

const WIZARD_STEPS: { key: WizardStep; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'steps', label: 'Steps' },
  { key: 'review', label: 'Review' },
];

type AssessmentWizardProps = {
  assessmentId?: AssessmentId;
  initialStep?: WizardStep;
};

export function AssessmentWizard({
  assessmentId,
  initialStep = 'overview',
}: AssessmentWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [overview, setOverview] = useState<ProcessOverviewData>({
    name: '',
    purpose: '',
    trigger: '',
    frequency: '',
    stakeholders: '',
  });

  const [steps, setSteps] = useState<StepData[]>([createEmptyStep()]);

  const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < WIZARD_STEPS.length) {
      setCurrentStep(WIZARD_STEPS[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(WIZARD_STEPS[prevIndex].key);
    }
  };

  const handleEditSection = (section: 'overview' | 'steps') => {
    setCurrentStep(section);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Build the process object
      const processId = createProcessId();
      const process: Process = {
        id: processId,
        name: overview.name,
        purpose: overview.purpose,
        trigger: overview.trigger,
        frequency: (overview.frequency || 'ad_hoc') as ProcessFrequency,
        stakeholders: overview.stakeholders
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        steps: steps.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          responsibleRole: s.responsibleRole,
          estimatedDuration: s.estimatedDuration,
          inputs: s.inputs
            .split(',')
            .map((i) => i.trim())
            .filter(Boolean),
          outputs: s.outputs
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean),
          tools: s.tools
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          painPoints: s.painPoints
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean),
        })),
      };

      // Save process
      saveProcess(process);

      // Run analysis
      const analysis = analyzeProcess(process);
      saveAnalysis(analysis);

      // Save assessment record
      const newAssessmentId = assessmentId || createAssessmentId();
      saveAssessment({
        id: newAssessmentId,
        processId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'completed',
        currentStep: WIZARD_STEPS.length,
        answers: { overview, steps },
      });

      // Navigate to results
      router.push(`/results/${processId}`);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setIsSubmitting(false);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 'overview') {
      return !overview.name || !overview.frequency;
    }
    if (currentStep === 'steps') {
      return steps.length === 0 || !steps.some((s) => s.name);
    }
    return false;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <WizardProgress
        steps={WIZARD_STEPS.map((s) => s.label)}
        currentStep={currentStepIndex}
        className="mb-8"
      />

      <div className="min-h-[400px]">
        {currentStep === 'overview' && (
          <ProcessOverviewForm data={overview} onChange={setOverview} />
        )}

        {currentStep === 'steps' && <ProcessStepsForm steps={steps} onChange={setSteps} />}

        {currentStep === 'review' && (
          <ReviewForm overview={overview} steps={steps} onEditSection={handleEditSection} />
        )}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={handleBack} disabled={currentStepIndex === 0}>
          Back
        </Button>

        {currentStep === 'review' ? (
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Generate Analysis
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={isNextDisabled()}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
