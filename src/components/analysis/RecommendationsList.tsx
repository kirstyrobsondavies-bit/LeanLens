import { Card, CardTitle } from '@/components/ui';

type RecommendationsListProps = {
  recommendations: string[];
  className?: string;
};

export function RecommendationsList({ recommendations, className = '' }: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardTitle className="mb-4">Recommendations</CardTitle>
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Your process is well-optimized. No major recommendations at this time.
        </p>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardTitle className="mb-4">Recommendations</CardTitle>

      <ol className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </span>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{rec}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
