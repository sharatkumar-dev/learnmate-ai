import { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MockBanner } from '@/components/MockBanner';

import { useLearnMate } from '@/context/LearnMateContext';
import { getRecommendations, ApiError } from '@/api/client';

export function Recommendations() {
  const { recommendations, setRecommendations } = useLearnMate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendations();
      setRecommendations(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load recommendations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {recommendations?._mock && <MockBanner />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recommendations</h1>
          <p className="text-muted-foreground mt-1">
            Curated resources based on your skill gaps.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {loading ? 'Refreshing…' : 'Refresh Recommendations'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!recommendations ? (
        <p className="text-muted-foreground">
          No recommendations yet. Complete onboarding to generate your
          personalised resource list.
        </p>
      ) : recommendations.recommendations.length === 0 ? (
        <p className="text-muted-foreground">No recommendations available.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.recommendations.map((rec) => (
            <Card key={rec.url} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold leading-tight">
                    {rec.title}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 capitalize">
                    {rec.type}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {rec.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <Badge variant="outline" className="text-xs">
                  {rec.skill}
                </Badge>
              </CardContent>
              <CardFooter>
                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    View Resource
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
