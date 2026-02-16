type ProgressBarProps = {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
};

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colorStyles = {
  primary: 'bg-primary-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  error: 'bg-red-600',
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'primary',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        <div
          className={`${colorStyles[color]} ${sizeStyles[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

type WizardProgressProps = {
  steps: string[];
  currentStep: number;
  className?: string;
};

export function WizardProgress({ steps, currentStep, className = '' }: WizardProgressProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    index < currentStep
                      ? 'bg-primary-600 text-white'
                      : index === currentStep
                        ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs text-center max-w-[80px]
                  ${index <= currentStep ? 'text-primary-600 font-medium' : 'text-gray-500 dark:text-gray-400'}
                `}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  w-12 h-0.5 mx-2 mt-[-20px]
                  ${index < currentStep ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
