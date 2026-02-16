'use client';

import type { InputHTMLAttributes } from 'react';

type InputProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>;

export function Input({ label, name, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
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
      />
      {hint && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

type TextareaProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  rows?: number;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>;

export function Textarea({
  label,
  name,
  error,
  hint,
  rows = 3,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`
          block w-full rounded-lg border px-3 py-2
          text-gray-900 dark:text-white
          bg-white dark:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${className}
        `}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
