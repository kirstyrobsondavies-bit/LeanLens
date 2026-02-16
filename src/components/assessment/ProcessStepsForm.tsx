'use client';

import { Button } from '@/components/ui';
import { StepCard } from './StepCard';
import type { StepData } from './StepCard';
import { createStepId } from '@/lib/id';

type ProcessStepsFormProps = {
  steps: StepData[];
  onChange: (steps: StepData[]) => void;
};

function createEmptyStep(): StepData {
  return {
    id: createStepId(),
    name: '',
    description: '',
    responsibleRole: '',
    estimatedDuration: 0,
    inputs: '',
    outputs: '',
    tools: '',
    painPoints: '',
  };
}

export function ProcessStepsForm({ steps, onChange }: ProcessStepsFormProps) {
  const handleStepChange = (index: number, updatedStep: StepData) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    onChange(newSteps);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    const newSteps = steps.filter((_, i) => i !== index);
    onChange(newSteps);
  };

  const handleAddStep = () => {
    onChange([...steps, createEmptyStep()]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Process Steps</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Break down your process into individual steps. Include as much detail as possible about
          each step, especially any pain points or issues you experience.
        </p>
      </div>

      <div>
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            stepNumber={index + 1}
            onChange={(updatedStep) => handleStepChange(index, updatedStep)}
            onRemove={() => handleRemoveStep(index)}
            isLast={steps.length === 1}
          />
        ))}
      </div>

      <Button variant="outline" onClick={handleAddStep} className="w-full">
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Another Step
      </Button>
    </div>
  );
}

export { createEmptyStep };
