'use client';

import type { SelectHTMLAttributes } from 'react';

type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectProps<T extends string> = {
  label: string;
  name: string;
  options: SelectOption<T>[];
  error?: string;
  hint?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'>;

export function Select<T extends string>({
  label,
  name,
  options,
  error,
  hint,
  className = '',
  ...props
}: SelectProps<T>) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`
          block w-full rounded-lg border px-3 py-2
          text-gray-900 dark:text-white
          bg-white dark:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${className}
        `}
        {...props}
      >
        <option value="">Select an option...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
