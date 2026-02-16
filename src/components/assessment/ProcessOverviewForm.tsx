'use client';

import type { ProcessFrequency } from '@/types/process';
import { Input, Textarea, Select } from '@/components/ui';

type ProcessOverviewData = {
  name: string;
  purpose: string;
  trigger: string;
  frequency: ProcessFrequency | '';
  stakeholders: string;
};

type ProcessOverviewFormProps = {
  data: ProcessOverviewData;
  onChange: (data: ProcessOverviewData) => void;
  errors?: Partial<Record<keyof ProcessOverviewData, string>>;
};

const frequencyOptions: { value: ProcessFrequency; label: string }[] = [
  { value: 'multiple_daily', label: 'Multiple times daily' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'ad_hoc', label: 'Ad-hoc / As needed' },
];

export function ProcessOverviewForm({ data, onChange, errors }: ProcessOverviewFormProps) {
  const handleChange = (field: keyof ProcessOverviewData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Process Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about the process you want to analyze. This helps us understand the context and
          purpose.
        </p>
      </div>

      <Input
        label="Process Name"
        name="processName"
        placeholder="e.g., Customer Onboarding, Invoice Processing"
        value={data.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors?.name}
        hint="Give your process a clear, descriptive name"
      />

      <Textarea
        label="Purpose / Description"
        name="purpose"
        placeholder="What is the goal of this process? What does it accomplish?"
        value={data.purpose}
        onChange={(e) => handleChange('purpose', e.target.value)}
        error={errors?.purpose}
        rows={3}
      />

      <Input
        label="Trigger"
        name="trigger"
        placeholder="e.g., New customer signup, Monthly report deadline"
        value={data.trigger}
        onChange={(e) => handleChange('trigger', e.target.value)}
        error={errors?.trigger}
        hint="What initiates this process?"
      />

      <Select
        label="How often does this process run?"
        name="frequency"
        options={frequencyOptions}
        value={data.frequency}
        onChange={(e) => handleChange('frequency', e.target.value as ProcessFrequency | '')}
        error={errors?.frequency}
      />

      <Input
        label="Key Stakeholders"
        name="stakeholders"
        placeholder="e.g., Sales Team, Finance Department, Operations Manager"
        value={data.stakeholders}
        onChange={(e) => handleChange('stakeholders', e.target.value)}
        error={errors?.stakeholders}
        hint="Separate multiple stakeholders with commas"
      />
    </div>
  );
}

export type { ProcessOverviewData };
