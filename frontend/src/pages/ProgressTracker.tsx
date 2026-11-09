import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MockBanner } from '@/components/MockBanner';

import { useLearnMate } from '@/context/LearnMateContext';
import { updateProgress, getProgressSummary, ApiError } from '@/api/client';
import type { ProgressSummary } from '@/types/index';

export function ProgressTracker() {
  const { pathway, progress, setProgress } = useLearnMate();
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!pathway) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const milestones = pathway.milestones
    .slice()
    .sort((a, b) => a.order - b.order);
  const completedCount = progress.completed.length;
  const totalCount = milestones.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  async function handleCheck(milestoneId: string, checked: boolean) {
    if (!checked) return; // only mark as complete, not uncomplete
    setUpdatingId(milestoneId);
    try {
      const updated = await updateProgress(milestoneId);
      setProgress(updated);
    } catch {
      // silently ignore — checkbox stays visual only on error
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleGetSummary() {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await getProgressSummary();
      setSummary(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setSummaryError(err.message);
      } else {
        setSummaryError('Failed to load summary. Please try again.');
      }
    } finally {
      setSummaryLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {summary?._mock && <MockBanner />}

      <div>
        <h1 className="text-2xl font-bold">Progress Tracker</h1>
        <p className="text-muted-foreground mt-1">
          {pathway.target_role} · {completedCount}/{totalCount} milestones
          completed
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Overall progress</span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} aria-label={`${pct}% complete`} />
      </div>

      {/* Milestone checklist */}
      <ul className="space-y-3" aria-label="Milestones">
        {milestones.map((milestone) => {
          const isCompleted = progress.completed.includes(milestone.id);
          const isUpdating = updatingId === milestone.id;
          return (
            <li
              key={milestone.id}
              className="flex items-start gap-3 rounded-md border bg-card p-3"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 mt-0.5 animate-spin text-muted-foreground" aria-hidden="true" />
              ) : (
                <Checkbox
                  id={`milestone-${milestone.id}`}
                  checked={isCompleted}
                  disabled={isCompleted}
                  onCheckedChange={(checked) =>
                    handleCheck(milestone.id, checked === true)
                  }
                  aria-label={`Mark "${milestone.title}" as complete`}
                />
              )}
              <label
                htmlFor={`milestone-${milestone.id}`}
                className={`text-sm leading-snug cursor-pointer ${
                  isCompleted ? 'line-through text-muted-foreground' : ''
                }`}
              >
                <span className="font-medium">{milestone.title}</span>
                <span className="block text-muted-foreground text-xs mt-0.5">
                  {milestone.description}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {/* AI Summary */}
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={handleGetSummary}
          disabled={summaryLoading}
        >
          {summaryLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {summaryLoading ? 'Generating summary…' : 'Get AI Summary'}
        </Button>

        {summaryError && (
          <Alert variant="destructive">
            <AlertDescription>{summaryError}</AlertDescription>
          </Alert>
        )}

        {summary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Progress Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{summary.narrative}</p>
              {summary.next_steps.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Next Steps
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {summary.next_steps.map((step) => (
                      <li key={step} className="text-sm">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
