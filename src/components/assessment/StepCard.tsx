'use client';

import { useState } from 'react';
import type { StepId } from '@/types/process';
import { Input, Textarea, Button, Card } from '@/components/ui';

type StepData = {
  id: StepId;
  name: string;
  description: string;
  responsibleRole: string;
  estimatedDuration: number;
  inputs: string;
  outputs: string;
  tools: string;
  painPoints: string;
};

type StepCardProps = {
  step: StepData;
  stepNumber: number;
  onChange: (step: StepData) => void;
  onRemove: () => void;
  isLast: boolean;
};

export function StepCard({ step, stepNumber, onChange, onRemove, isLast }: StepCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (field: keyof StepData, value: string | number) => {
    onChange({ ...step, [field]: value });
  };

  return (
    <Card className="mb-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-semibold text-sm">
            {stepNumber}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {step.name || `Step ${stepNumber}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isLast && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              Remove
            </Button>
          )}
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Step Name"
              name={`step-${step.id}-name`}
              placeholder="e.g., Collect customer information"
              value={step.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />

            <Input
              label="Responsible Role"
              name={`step-${step.id}-role`}
              placeholder="e.g., Sales Rep, Operations Manager"
              value={step.responsibleRole}
              onChange={(e) => handleChange('responsibleRole', e.target.value)}
            />
          </div>

          <Textarea
            label="Description"
            name={`step-${step.id}-description`}
            placeholder="What happens in this step?"
            value={step.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={2}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Estimated Duration (minutes)"
              name={`step-${step.id}-duration`}
              type="number"
              min={1}
              placeholder="30"
              value={step.estimatedDuration || ''}
              onChange={(e) => handleChange('estimatedDuration', parseInt(e.target.value) || 0)}
            />

            <Input
              label="Inputs"
              name={`step-${step.id}-inputs`}
              placeholder="e.g., Customer email, Order form"
              value={step.inputs}
              onChange={(e) => handleChange('inputs', e.target.value)}
              hint="Comma-separated"
            />

            <Input
              label="Outputs"
              name={`step-${step.id}-outputs`}
              placeholder="e.g., Completed form, Report"
              value={step.outputs}
              onChange={(e) => handleChange('outputs', e.target.value)}
              hint="Comma-separated"
            />
          </div>

          <Input
            label="Tools / Systems Used"
            name={`step-${step.id}-tools`}
            placeholder="e.g., Excel, CRM, Email"
            value={step.tools}
            onChange={(e) => handleChange('tools', e.target.value)}
            hint="Comma-separated"
          />

          <Textarea
            label="Pain Points & Issues"
            name={`step-${step.id}-painPoints`}
            placeholder="What problems do you experience with this step? What takes too long? What causes errors?"
            value={step.painPoints}
            onChange={(e) => handleChange('painPoints', e.target.value)}
            rows={2}
            hint="Describe any frustrations, delays, or inefficiencies"
          />
        </div>
      )}
    </Card>
  );
}

export type { StepData };
