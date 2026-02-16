import { AssessmentWizard } from '@/components/assessment';

export const metadata = {
  title: 'Process Assessment - LeanLens',
  description: 'Analyze your business process using Lean Six Sigma methodologies',
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Process Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tell us about your process and we&apos;ll analyze it using Lean Six Sigma principles.
          </p>
        </div>

        <AssessmentWizard />
      </div>
    </main>
  );
}
