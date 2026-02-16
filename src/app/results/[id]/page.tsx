'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Process, ProcessId } from '@/types/process';
import type { ProcessAnalysis } from '@/types/analysis';
import { loadProcess, loadAnalysis } from '@/lib/storage/assessment-storage';
import { analyzeProcess } from '@/lib/analysis/analyze-process';
import { ResultsDashboard } from '@/components/analysis';
import { Button } from '@/components/ui';

export default function ResultsPage() {
  const params = useParams();
  const processId = params.id as ProcessId;

  const [process, setProcess] = useState<Process | null>(null);
  const [analysis, setAnalysis] = useState<ProcessAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const loadedProcess = loadProcess(processId);

        if (!loadedProcess) {
          setError('Process not found. It may have been deleted or the link is invalid.');
          setLoading(false);
          return;
        }

        setProcess(loadedProcess);

        // Try to load existing analysis, or regenerate if not found
        let loadedAnalysis = loadAnalysis(processId);
        if (!loadedAnalysis) {
          loadedAnalysis = analyzeProcess(loadedProcess);
        }

        setAnalysis(loadedAnalysis);
        setLoading(false);
      } catch (err) {
        console.error('Error loading results:', err);
        setError('Failed to load analysis results.');
        setLoading(false);
      }
    };

    loadData();
  }, [processId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analysis...</p>
        </div>
      </main>
    );
  }

  if (error || !process || !analysis) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Analysis Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The requested analysis could not be found.'}
          </p>
          <Link href="/assessment">
            <Button>Start New Assessment</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <ResultsDashboard process={process} analysis={analysis} />
    </main>
  );
}
